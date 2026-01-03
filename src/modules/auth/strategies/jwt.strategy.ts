import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import { Jwtpayload } from '../interfaces/jwt.payload';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET not set');

    super({
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: FastifyRequest) => req?.cookies?.auth_token ?? null,
      ]),
    });
  }

  async validate(payload: Jwtpayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });
    if (!user) return null; // opcional: lanzar excepción si querés
    return user;
  }
}
