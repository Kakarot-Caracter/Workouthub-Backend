import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from 'src/database/prisma.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET') || 'OneBigSecret',
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
