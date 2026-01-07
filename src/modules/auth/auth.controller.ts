import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { MailService } from '../mail/mail.service';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterAuthDto, @Res() reply: FastifyReply) {
    const { user, token } = await this.authService.register(dto);

    reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',

        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      .status(201)
      .send({ message: 'Registro exitoso', user });
  }

  @Post('login')
  async login(@Body() dto: LoginAuthDto, @Res() reply: FastifyReply) {
    const { user, token } = await this.authService.login(dto);

    reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',

        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      .status(200)
      .send({ message: 'Login exitoso', user });
  }

  @Post('logout')
  logout(@Res() reply: FastifyReply) {
    reply
      .clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      })

      .status(200)
      .send({ message: 'Logout exitoso' });
  }

  @Get('me')
  async me(@Req() req: FastifyRequest) {
    const token = req.cookies?.token;
    if (!token) throw new UnauthorizedException('No auth token');

    const payload = this.authService.verifyToken(token);
    const user = await this.authService.getUserById(payload.id);
    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }

  @Post('forgot-password')
  async forgot(@Body() dto: ForgotPasswordDto) {
    const token = await this.authService.generateResetToken(dto.email);
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.mailService.sendResetPasswordEmail(dto.email, link);
    return { message: 'Email de reseteo enviado' };
  }

  @Post('reset-password')
  async reset(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Contraseña actualizada correctamente' };
  }
}
