import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Jwtpayload } from './interfaces/jwt.payload';

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

  private signToken(payload: Jwtpayload): string {
    return this.jwtService.sign(payload);
  }
}
