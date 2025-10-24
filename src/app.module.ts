import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoutinesModule } from './modules/routines/routines.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RoutinesModule,
    ExercisesModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
