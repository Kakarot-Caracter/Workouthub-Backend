import { Module } from '@nestjs/common';
import { FoodService } from './foods.service';
import { FoodController } from './foods.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
