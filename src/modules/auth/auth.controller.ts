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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterAuthDto, @Res() reply: FastifyReply) {
    const { user, token } = await this.authService.register(dto);

    const isProd = process.env.NODE_ENV === 'production';
    const oneDaySeconds = 24 * 60 * 60;

    reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'none',
        path: '/',
        maxAge: oneDaySeconds,
        expires: new Date(Date.now() + oneDaySeconds * 1000),
      })
      .status(201)
      .send({ message: 'Registro exitoso', user });
  }

  @Post('login')
  async login(@Body() dto: LoginAuthDto, @Res() reply: FastifyReply) {
    const { user, token } = await this.authService.login(dto);

    const isProd = process.env.NODE_ENV === 'production';
    const oneDaySeconds = 24 * 60 * 60;

    reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'none',
        path: '/',
        maxAge: oneDaySeconds,
        expires: new Date(Date.now() + oneDaySeconds * 1000),
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
}
