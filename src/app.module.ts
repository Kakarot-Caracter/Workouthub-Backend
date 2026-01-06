import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { RoutinesModule } from './modules/routines/routines.module';
import { UserModule } from './modules/user/user.module';
import { DietModule } from './modules/diets/diets.module';
import { FoodModule } from './modules/foods/foods.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RoutinesModule,
    ExercisesModule,
    DietModule,
    UserModule,
    FoodModule,
    MailerModule,
  ],
  controllers: [],
})
export class AppModule {}
