import { UserRepository } from '../repositories/UserRepository.js';
import { EmailService } from './EmailService.js';
import { hashPassword, isValidPassword } from '../utils/crypto.js';
import jwt from 'jsonwebtoken';

export class PasswordResetService {
    constructor() {
        this.userRepository = new UserRepository();
        this.emailService = new EmailService();
        this.resetTokens = new Map();
    }

    async requestPasswordReset(email) {
        try {

            const user = await this.userRepository.getUserByEmail(email);
            if (!user) {
                return {
                    success: true,
                    message: 'Si el email existe, recibirás un enlace de recuperación'
                };
            }

            const resetToken = jwt.sign(
                {
                    userId: user._id.toString(),
                    email: user.email,
                    timestamp: Date.now()
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            this.resetTokens.set(resetToken, {
                userId: user._id.toString(),
                email: user.email,
                createdAt: Date.now(),
                used: false
            });

            setTimeout(() => {
                this.resetTokens.delete(resetToken);
            }, 60 * 60 * 1000);

            await this.emailService.sendPasswordResetEmail(
                user.email,
                resetToken,
                user.first_name
            );

            return {
                success: true,
                message: 'Si el email existe, recibirás un enlace de recuperación'
            };
        } catch (error) {
            console.error('Error en requestPasswordReset:', error);
            throw new Error(`Error requesting password reset: ${error.message}`);
        }
    }

    async validateResetToken(token) {
        try {

            const tokenData = this.resetTokens.get(token);
            if (!tokenData) {
                throw new Error('Token inválido o expirado');
            }

            if (tokenData.used) {
                throw new Error('Token ya utilizado');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const tokenAge = Date.now() - tokenData.createdAt;
            const oneHour = 60 * 60 * 1000;

            if (tokenAge > oneHour) {
                this.resetTokens.delete(token);
                throw new Error('Token expirado');
            }

            const user = await this.userRepository.getUserById(decoded.userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            return {
                valid: true,
                userId: decoded.userId,
                email: decoded.email
            };
        } catch (error) {
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

            const validation = await this.validateResetToken(token);
            if (!validation.valid) {
                throw new Error('Token inválido o expirado');
            }

            const user = await this.userRepository.getUserById(validation.userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            if (isValidPassword(newPassword, user.password)) {
                throw new Error('La nueva contraseña no puede ser igual a la contraseña actual');
            }

            const hashedNewPassword = hashPassword(newPassword);

            await this.userRepository.updatePassword(
                validation.userId,
                hashedNewPassword,
                user.password
            );

            const tokenData = this.resetTokens.get(token);
            if (tokenData) {
                tokenData.used = true;
            }

            setTimeout(() => {
                this.resetTokens.delete(token);
            }, 5 * 60 * 1000);

            return {
                success: true,
                message: 'Contraseña actualizada exitosamente'
            };
        } catch (error) {
            console.error('Error en resetPassword:', error);
            throw new Error(`Error resetting password: ${error.message}`);
        }
    }

    async invalidateToken(token) {
        try {
            const tokenData = this.resetTokens.get(token);
            if (tokenData) {
                tokenData.used = true;
            }
        } catch (error) {
            console.error('Error invalidating token:', error);
        }
    }

    cleanupExpiredTokens() {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        for (const [token, data] of this.resetTokens.entries()) {
            if (now - data.createdAt > oneHour) {
                this.resetTokens.delete(token);
            }
        }
    }

    getTokenStats() {
        const now = Date.now();
        const stats = {
            total: this.resetTokens.size,
            used: 0,
            expired: 0,
            active: 0
        };

        for (const [token, data] of this.resetTokens.entries()) {
            if (data.used) {
                stats.used++;
            } else if (now - data.createdAt > 60 * 60 * 1000) {
                stats.expired++;
            } else {
                stats.active++;
            }
        }

        return stats;
    }
}