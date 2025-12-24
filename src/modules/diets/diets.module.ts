import { Module } from '@nestjs/common';
import { DietService } from './diets.service';
import { DietController } from './diets.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DietController],
  providers: [DietService],
  exports: [DietService],
})
export class DietModule {}
