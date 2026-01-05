import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
    @Res() reply: FastifyReply,
  ) {
    const { user, token } = await this.authService.register(registerAuthDto);
    const isProd = process.env.NODE_ENV === 'production';
    const oneDayMs = 24 * 60 * 60 * 1000;

    reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: isProd, // HTTPS en producción
        sameSite: 'none', // requerido para cross-site
        path: '/',
        expires: new Date(Date.now() + oneDayMs),
        maxAge: 24 * 60 * 60, // en segundos
      })
      .status(201)
      .send({ message: 'Registro exitoso', user });
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res() reply: FastifyReply) {
    const { user, token } = await this.authService.login(loginAuthDto);
    const isProd = process.env.NODE_ENV === 'production';
    const oneDayMs = 24 * 60 * 60 * 1000;

    reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'none',
        path: '/',
        expires: new Date(Date.now() + oneDayMs),
        maxAge: 24 * 60 * 60,
      })
      .status(200)
      .send({ message: 'Login exitoso', user });
  }

  @Post('logout')
  logout(@Res() reply: FastifyReply) {
    const isProd = process.env.NODE_ENV === 'production';
    reply
      .clearCookie('token', {
        path: '/',
        sameSite: 'none',
        secure: isProd,
      })
      .status(200)
      .send({ message: 'Logout exitoso' });
  }
}
