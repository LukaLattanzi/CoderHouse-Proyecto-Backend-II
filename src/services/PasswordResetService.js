import { UserRepository } from '../repositories/UserRepository.js';
import { EmailService } from './EmailService.js';
import { hashPassword, isValidPassword } from '../utils/crypto.js';
import { PasswordResetTokenModel } from '../models/password-reset-token.model.js';
import jwt from 'jsonwebtoken';

export class PasswordResetService {
    constructor() {
        this.userRepository = new UserRepository();
        this.emailService = new EmailService();
    }

    async requestPasswordReset(email) {
        try {
            console.log('🔄 Solicitando reset de contraseña para:', email);

            const user = await this.userRepository.getUserByEmail(email);
            if (!user) {
                console.log('❌ Usuario no encontrado para email:', email);
                return {
                    success: true,
                    message: 'Si el email existe, recibirás un enlace de recuperación'
                };
            }

            console.log('✅ Usuario encontrado:', user.email);

            await PasswordResetTokenModel.deleteMany({ userId: user._id });
            console.log('🗑️ Tokens anteriores eliminados para el usuario');

            const resetToken = jwt.sign(
                {
                    userId: user._id.toString(),
                    email: user.email,
                    timestamp: Date.now()
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            console.log('🔑 Token JWT generado');

            await PasswordResetTokenModel.create({
                token: resetToken,
                userId: user._id,
                email: user.email,
                used: false
            });

            console.log('💾 Token guardado en base de datos');

            await this.emailService.sendPasswordResetEmail(
                user.email,
                resetToken,
                user.first_name
            );

            console.log('📧 Email de recuperación enviado');

            return {
                success: true,
                message: 'Si el email existe, recibirás un enlace de recuperación'
            };
        } catch (error) {
            console.error('❌ Error en requestPasswordReset:', error);
            throw new Error(`Error requesting password reset: ${error.message}`);
        }
    }

    async validateResetToken(token) {
        try {
            console.log('🔍 Validando token...', token ? 'Token presente' : 'Token ausente');

            const tokenData = await PasswordResetTokenModel.findOne({ token });
            if (!tokenData) {
                console.log('❌ Token no encontrado en base de datos');
                throw new Error('Token inválido o expirado');
            }

            console.log('✅ Token encontrado en base de datos para:', tokenData.email);

            if (tokenData.used) {
                console.log('❌ Token ya utilizado');
                throw new Error('Token ya utilizado');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('✅ Token JWT válido para userId:', decoded.userId);

            const tokenAge = Date.now() - tokenData.createdAt.getTime();
            const oneHour = 60 * 60 * 1000;

            if (tokenAge > oneHour) {
                console.log('❌ Token expirado, edad:', Math.round(tokenAge / (60 * 1000)), 'minutos');
                await PasswordResetTokenModel.deleteOne({ token });
                throw new Error('Token expirado');
            }

            console.log('✅ Token dentro del tiempo válido, edad:', Math.round(tokenAge / (60 * 1000)), 'minutos');

            const user = await this.userRepository.getUserById(decoded.userId);
            if (!user) {
                console.log('❌ Usuario no encontrado para ID:', decoded.userId);
                throw new Error('Usuario no encontrado');
            }

            console.log('✅ Usuario encontrado:', user.email);

            return {
                valid: true,
                userId: decoded.userId,
                email: decoded.email
            };
        } catch (error) {
            console.log('❌ Error en validateResetToken:', error.message);
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Token inválido');
            }
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expirado');
            }
            throw new Error(`Error validating reset token: ${error.message}`);
        }
    }

    async resetPassword(token, newPassword) {
        try {
            console.log('🔄 Iniciando reset de contraseña...');

            const validation = await this.validateResetToken(token);
            if (!validation.valid) {
                throw new Error('Token inválido o expirado');
            }

            const user = await this.userRepository.getUserById(validation.userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            console.log('🔐 Verificando que la nueva contraseña sea diferente...');
            if (isValidPassword(newPassword, user.password)) {
                console.log('❌ La nueva contraseña es igual a la actual');
                throw new Error('La nueva contraseña debe ser diferente a la contraseña actual');
            }

            console.log('✅ La nueva contraseña es diferente a la actual');

            console.log('🔐 Hasheando nueva contraseña...');
            const hashedNewPassword = hashPassword(newPassword);

            console.log('💾 Actualizando contraseña en base de datos...');
            await this.userRepository.updatePassword(
                validation.userId,
                hashedNewPassword,
                user.password
            );

            console.log('✅ Marcando token como usado...');
            await PasswordResetTokenModel.updateOne(
                { token },
                { used: true }
            );

            console.log('🎉 Contraseña restablecida exitosamente para:', user.email);

            return {
                success: true,
                message: 'Contraseña restablecida exitosamente'
            };
        } catch (error) {
            console.error('❌ Error en resetPassword:', error);

            if (error.message.includes('nueva contraseña debe ser diferente') ||
                error.message.includes('nueva contraseña no puede ser igual')) {
                throw error;
            }

            throw new Error(`Error resetting password: ${error.message}`);
        }
    }

    async cleanupExpiredTokens() {
        try {
            const oneHour = 60 * 60 * 1000;
            const expiredAt = new Date(Date.now() - oneHour);

            const result = await PasswordResetTokenModel.deleteMany({
                createdAt: { $lt: expiredAt }
            });

            console.log(`🧹 Limpieza: ${result.deletedCount} tokens expirados eliminados`);
            return result.deletedCount;
        } catch (error) {
            console.error('Error en cleanupExpiredTokens:', error);
            return 0;
        }
    }

    async getTokenStats() {
        try {
            const total = await PasswordResetTokenModel.countDocuments();
            const used = await PasswordResetTokenModel.countDocuments({ used: true });
            const active = await PasswordResetTokenModel.countDocuments({ used: false });

            return {
                total,
                used,
                active
            };
        } catch (error) {
            console.error('Error en getTokenStats:', error);
            return { total: 0, used: 0, active: 0 };
        }
    }
}