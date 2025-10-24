import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService],
  imports: [PrismaModule, AuthModule],
})
export class ExercisesModule {}
