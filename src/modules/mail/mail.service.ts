import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendResetPasswordEmail(to: string, link: string) {
    const html = `
      <p>Hola,</p>
      <p>Pulsa el siguiente enlace para restablecer tu contraseña:</p>
      <p><a href="${link}">Restablecer contraseña</a></p>
      <p>Si no solicitaste este correo, ignóralo.</p>
    `;
    await this.mailer.sendMail({
      to,
      subject: 'Restablecer contraseña',
      html,
      text: `Visita este enlace para restablecer tu contraseña: ${link}`,
    });
  }
}
