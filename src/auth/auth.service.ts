import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Jwtpayload } from './interfaces/jwt.payload';

import { Response } from 'express';

import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async register(registerAuthDto: RegisterAuthDto, res: Response) {
    const isExistingUser = await this.prisma.user.findFirst({
      where: { email: registerAuthDto.email },
    });

    if (isExistingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: { ...registerAuthDto, password: hashedPassword },
    });

    const token = this.signToken({ id: newUser.id });

    this.setCookie(res, token);

    return { id: newUser.id, email: newUser.email, username: newUser.username };
  }

  async login(loginAuthDto: LoginAuthDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginAuthDto.email },
    });

    if (!user) throw new BadRequestException('User not found');

    const isValidPassword = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );

    if (!isValidPassword) throw new UnauthorizedException('Invalid password.');

    const token = this.signToken({ id: user.id });

    this.setCookie(res, token);

    return { id: user.id, email: user.email, username: user.username };
  }

  logout(res: Response): void {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
  }

  private signToken(payload: Jwtpayload): string {
    return this.jwtService.sign(payload);
  }

  private setCookie(res: Response, token: string) {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false, // en local NO uses https
      sameSite: 'lax', // más permisivo para pruebas
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
      path: '/', // toda la app
    });
  }
}
