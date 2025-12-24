import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodService {
  constructor(private readonly prisma: PrismaService) {}

  async createFood(dietId: number, createFoodDto: CreateFoodDto) {
    return this.prisma.food.create({
      data: { ...createFoodDto, dietId },
    });
  }

  async findAllFoods(dietId: number) {
    return this.prisma.food.findMany({ where: { dietId } });
  }

  async findOneFood(id: number, dietId: number) {
    const food = await this.prisma.food.findFirst({ where: { id, dietId } });
    if (!food) throw new NotFoundException(`Food #${id} not found in diet`);
    return food;
  }

  async updateFood(id: number, dietId: number, updateFoodDto: UpdateFoodDto) {
    await this.findOneFood(id, dietId);
    return this.prisma.food.update({
      where: { id },
      data: updateFoodDto,
    });
  }

  async removeFood(id: number, dietId: number) {
    await this.findOneFood(id, dietId);
    return this.prisma.food.delete({ where: { id } });
  }
}
