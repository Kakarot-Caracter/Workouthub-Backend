import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { RoutinesModule } from './modules/routines/routines.module';
import { UserModule } from './modules/user/user.module';
import { DietModule } from './modules/diets/diets.module';
import { FoodModule } from './modules/foods/foods.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SetAuthCookieInterceptor } from './common/interceptors/set-auth-cookie.interceptor';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RoutinesModule,
    ExercisesModule,
    DietModule,
    UserModule,
    FoodModule,
  ],
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: SetAuthCookieInterceptor }],
})
export class AppModule {}
