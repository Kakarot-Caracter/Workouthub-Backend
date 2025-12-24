import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';

@Injectable()
export class DietService {
  constructor(private readonly prisma: PrismaService) {}

  async createDiet(userId: number, createDietDto: CreateDietDto) {
    return this.prisma.diet.create({
      data: { ...createDietDto, userId },
    });
  }

  async findAllDiets(userId: number) {
    return this.prisma.diet.findMany({
      where: { userId },
      include: { foods: true },
    });
  }

  async findOneDiet(id: number, userId: number) {
    const diet = await this.prisma.diet.findFirst({
      where: { id, userId },
      include: { foods: true },
    });
    if (!diet) throw new NotFoundException(`Diet #${id} not found`);
    return diet;
  }

  async updateDiet(id: number, userId: number, updateDietDto: UpdateDietDto) {
    await this.findOneDiet(id, userId);
    return this.prisma.diet.update({
      where: { id },
      data: updateDietDto,
    });
  }

  async removeDiet(id: number, userId: number) {
    await this.findOneDiet(id, userId);
    return this.prisma.diet.delete({ where: { id } });
  }
}
