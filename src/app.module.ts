import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RoutinesModule } from './routines/routines.module';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [PrismaModule, AuthModule, RoutinesModule, ExercisesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
