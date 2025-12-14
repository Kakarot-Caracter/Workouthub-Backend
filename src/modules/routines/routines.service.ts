import { Injectable, NotFoundException } from '@nestjs/common';
import type { Routine } from '@prisma/client';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RoutinesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoutine(
    createRoutineDto: CreateRoutineDto,
    userId: number,
  ): Promise<Routine> {
    const newRoutine = await this.prisma.routine.create({
      data: {
        ...createRoutineDto,
        userId,
      },
    });
    return newRoutine;
  }

  async findAllRoutines(userId: number): Promise<Routine[]> {
    return this.prisma.routine.findMany({
      where: { userId },
    });
  }

  async findOneRoutine(id: number, userId: number): Promise<Routine> {
    const routine = await this.prisma.routine.findFirst({
      where: { id, userId },
    });
    if (!routine) throw new NotFoundException(`Routine #${id} not found`);
    return routine;
  }

  async updateRoutine(
    id: number,
    updateRoutineDto: UpdateRoutineDto,
    userId: number,
  ): Promise<Routine> {
    const routine = await this.findOneRoutine(id, userId);

    return this.prisma.routine.update({
      where: { id: routine.id },
      data: updateRoutineDto,
    });
  }

  async removeRoutine(id: number, userId: number): Promise<Routine> {
    const routine = await this.findOneRoutine(id, userId);

    return this.prisma.routine.delete({
      where: { id: routine.id },
    });
  }
}
