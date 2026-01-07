import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Jwtpayload } from '../interfaces/jwt.payload';
import { PrismaService } from 'src/database/prisma.service';

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
        (req: unknown) => {
          if (typeof req === 'object' && req !== null && 'cookies' in req) {
            return (req as { cookies: Record<string, string> }).cookies.token;
          }
          return null;
        },
      ]),
    });
  }

  async validate(payload: Jwtpayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });
    return user;
  }
}
