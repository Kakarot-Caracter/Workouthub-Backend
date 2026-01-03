import { Body, Controller, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    const response = await this.authService.register(registerAuthDto);
    return { message: 'Registro exitoso', ...response };
  }

  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { user, token } = await this.authService.login(loginAuthDto);

    const isProduction = process.env.NODE_ENV === 'production';

    reply.setCookie('auth_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      // IMPORTANTE: No establecer domain permite que la cookie funcione
      // en cualquier origen que haga peticiones al backend
      maxAge: 7 * 24 * 60 * 60,
    });

    // En el controlador, después de setCookie
    console.log('Cookie config:', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      domain: 'NO SET',
    });

    return { message: 'Login exitoso', user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) reply: FastifyReply) {
    reply.clearCookie('auth_token', { path: '/' });
    return { message: 'Logout exitoso' };
  }
}
