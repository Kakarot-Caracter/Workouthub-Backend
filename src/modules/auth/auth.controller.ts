import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { SetAuthCookieInterceptor } from '../../common/interceptors/set-auth-cookie.interceptor';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@UseInterceptors(SetAuthCookieInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    const response = await this.authService.register(registerAuthDto);
    return { message: 'Registro exitoso', ...response };
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const response = await this.authService.login(loginAuthDto);
    return { message: 'Login exitoso', ...response };
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
