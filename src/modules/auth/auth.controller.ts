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

    reply.status(201).send({ message: 'Registro exitoso', user, token });
  }

  @Post('login')
  async login(@Body() dto: LoginAuthDto, @Res() reply: FastifyReply) {
    const { user, token } = await this.authService.login(dto);

    reply.status(200).send({ message: 'Login exitoso', user, token });
  }

  @Post('logout')
  logout(@Res() reply: FastifyReply) {
    reply.status(200).send({ message: 'Logout exitoso' });
  }

  @Get('me')
  async me(@Req() req: FastifyRequest) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No auth token');

    const token = authHeader.split(' ')[1];
    const payload = this.authService.verifyToken(token);
    const user = await this.authService.getUserById(payload.id);
    if (!user) throw new UnauthorizedException();

    return { id: user.id, username: user.username, email: user.email };
  }
}
