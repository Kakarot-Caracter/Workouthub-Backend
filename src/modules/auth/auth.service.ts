import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from '../user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Jwtpayload } from './interfaces/jwt.payload';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);

    const token = this.signToken({ id: user.id });

    return {
      user: { id: user.id, email: user.email, username: user.username },
      token,
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginAuthDto.email },
    });

    if (!user) throw new BadRequestException('Usuario no registrado.');

    const valid = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!valid) throw new UnauthorizedException('Contraseña inválida.');

    const token = this.signToken({ id: user.id });

    return {
      user: { id: user.id, email: user.email, username: user.username },
      token,
    };
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Email no registrado');

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpires: expires },
    });

    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });
    if (!user) throw new BadRequestException('Token inválido o expirado');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpires: null,
      },
    });
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify<Jwtpayload>(token);
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private signToken(payload: Jwtpayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }
}
