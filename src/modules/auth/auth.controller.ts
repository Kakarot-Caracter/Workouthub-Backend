import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { SetAuthCookieInterceptor } from '../../common/interceptors/set-auth-cookie.interceptor';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register NO usa interceptor, no toca cookies
  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    const response = await this.authService.register(registerAuthDto);
    return { message: 'Registro exitoso', ...response };
  }

  // Login usa interceptor para setear cookie
  @Post('login')
  @UseInterceptors(SetAuthCookieInterceptor)
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const response = await this.authService.login(loginAuthDto);
    return { message: 'Login exitoso', ...response };
  }

  // Logout usa interceptor para borrar cookie
  @Post('logout')
  @UseInterceptors(SetAuthCookieInterceptor)
  logout() {
    return this.authService.logout(); // debe devolver { clearCookie: true }
  }
}
