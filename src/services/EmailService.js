import nodemailer from 'nodemailer';

export class EmailService {
    constructor() {
        this.transporter = null;
        this.isEthereal = false;
        this.initializeTransporter();
    }

    async initializeTransporter() {
        try {
            // Intentar configurar Gmail primero
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com') {
                console.log('🔧 Configurando transporter de Gmail...');
                this.transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                // Verificar la conexión
                await this.transporter.verify();
                console.log('✅ Gmail transporter configurado exitosamente');
                this.isEthereal = false;
                
            } else {
                throw new Error('Credenciales de Gmail no configuradas');
            }
        } catch (error) {
            console.log('⚠️ Gmail no disponible, configurando Ethereal para testing...');
            
            // Usar Ethereal como fallback para testing
            const testAccount = await nodemailer.createTestAccount();
            
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            
            this.isEthereal = true;
            console.log('📧 Ethereal Email configurado para testing:');
            console.log(`   Email: ${testAccount.user}`);
            console.log(`   Password: ${testAccount.pass}`);
            console.log('   Los emails se pueden ver en: https://ethereal.email');
        }
    }

    async sendPasswordResetEmail(userEmail, resetToken, userName) {
        try {
            // Esperar a que el transporter esté inicializado si es necesario
            if (!this.transporter) {
                await this.initializeTransporter();
            }

            const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

            const mailOptions = {
                from: this.isEthereal ? '"E-commerce Support" <support@ecommerce.com>' : process.env.EMAIL_USER,
                to: userEmail,
                subject: 'Recuperación de Contraseña - E-commerce',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #007bff; margin: 0; font-size: 28px;">🔐 E-commerce</h1>
                                <p style="color: #666; margin: 5px 0 0 0;">Recuperación de Contraseña</p>
                            </div>
                            
                            <h2 style="color: #333; margin-bottom: 20px;">Hola ${userName},</h2>
                            
                            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en nuestra tienda online.
                            </p>
                            
                            <div style="margin: 30px 0; text-align: center;">
                                <a href="${resetUrl}" 
                                   style="background: linear-gradient(135deg, #007bff, #0056b3); 
                                          color: white; padding: 15px 30px; text-decoration: none; 
                                          border-radius: 8px; display: inline-block; font-weight: bold;
                                          font-size: 16px; box-shadow: 0 4px 8px rgba(0,123,255,0.3);">
                                    🔑 Restablecer Mi Contraseña
                                </a>
                            </div>
                            
                            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p style="color: #856404; margin: 0; font-size: 14px;">
                                    <strong>⏰ Importante:</strong> Este enlace expirará en <strong>1 hora</strong> por razones de seguridad.
                                </p>
                            </div>
                            
                            <p style="color: #666; font-size: 14px; line-height: 1.5;">
                                Si no solicitaste este cambio, puedes ignorar este correo electrónico. 
                                Tu contraseña no será modificada y tu cuenta permanecerá segura.
                            </p>
                            
                            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                            
                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                                <p style="color: #6c757d; font-size: 12px; margin: 0;">
                                    <strong>¿El botón no funciona?</strong><br>
                                    Copia y pega este enlace en tu navegador:<br>
                                    <span style="word-break: break-all;">${resetUrl}</span>
                                </p>
                            </div>
                            
                            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                                <p style="color: #999; font-size: 12px; margin: 0;">
                                    © 2024 E-commerce. Todos los derechos reservados.<br>
                                    Este email fue enviado desde una dirección que no acepta respuestas.
                                </p>
                            </div>
                        </div>
                    </div>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);

            if (this.isEthereal) {
                console.log('📧 Email enviado exitosamente usando Ethereal:');
                console.log(`   Message ID: ${info.messageId}`);
                console.log(`   Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
                
                return {
                    success: true,
                    messageId: info.messageId,
                    previewUrl: nodemailer.getTestMessageUrl(info),
                    provider: 'ethereal'
                };
            } else {
                console.log('📧 Email enviado exitosamente usando Gmail');
                return {
                    success: true,
                    messageId: info.messageId,
                    provider: 'gmail'
                };
            }

        } catch (error) {
            console.error('❌ Error sending password reset email:', error);
            throw new Error(`Error sending password reset email: ${error.message}`);
        }
    }
}
