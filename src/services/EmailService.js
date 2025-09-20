import nodemailer from 'nodemailer';

export class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendPasswordResetEmail(userEmail, resetToken, userName) {
        try {
            const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: 'Recuperación de Contraseña - E-commerce',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Recuperación de Contraseña</h2>
                        
                        <p>Hola ${userName},</p>
                        
                        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                        
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${resetUrl}" 
                               style="background-color: #007bff; color: white; padding: 12px 30px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                Restablecer Contraseña
                            </a>
                        </div>
                        
                        <p style="color: #666; font-size: 14px;">
                            <strong>Importante:</strong> Este enlace expirará en 1 hora por razones de seguridad.
                        </p>
                        
                        <p style="color: #666; font-size: 14px;">
                            Si no solicitaste este cambio, puedes ignorar este correo electrónico. 
                            Tu contraseña no será modificada.
                        </p>
                        
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                        
                        <p style="color: #999; font-size: 12px;">
                            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                            <a href="${resetUrl}">${resetUrl}</a>
                        </p>
                        
                        <p style="color: #999; font-size: 12px;">
                            E-commerce Team
                        </p>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email de recuperación enviado:', result.messageId);
            return result;
        } catch (error) {
            console.error('❌ Error enviando email de recuperación:', error);
            throw new Error(`Error sending password reset email: ${error.message}`);
        }
    }

    async sendPurchaseConfirmation(userEmail, ticket, userName) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: `Confirmación de Compra - Ticket #${ticket.code}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #28a745;">¡Compra Confirmada!</h2>
                        
                        <p>Hola ${userName},</p>
                        
                        <p>Tu compra ha sido procesada exitosamente.</p>
                        
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Detalles de la Compra</h3>
                            <p><strong>Número de Ticket:</strong> ${ticket.code}</p>
                            <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString('es-ES')}</p>
                            <p><strong>Total:</strong> $${ticket.amount.toFixed(2)}</p>
                        </div>
                        
                        <h4>Productos Comprados:</h4>
                        <ul style="list-style: none; padding: 0;">
                            ${ticket.products.map(item => `
                                <li style="background-color: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 5px;">
                                    <strong>${item.product.title}</strong><br>
                                    Cantidad: ${item.quantity} | Precio: $${item.price.toFixed(2)}
                                    <div style="text-align: right; color: #007bff;">
                                        Subtotal: $${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                        
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            Gracias por tu compra. Si tienes alguna pregunta, no dudes en contactarnos.
                        </p>
                        
                        <p style="color: #999; font-size: 12px;">
                            E-commerce Team
                        </p>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email de confirmación de compra enviado:', result.messageId);
            return result;
        } catch (error) {
            console.error('❌ Error enviando email de confirmación:', error);
            throw new Error(`Error sending purchase confirmation email: ${error.message}`);
        }
    }

    async testConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Conexión de email verificada correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error en la conexión de email:', error);
            return false;
        }
    }
}