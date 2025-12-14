import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import type { Exercise } from '@prisma/client';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  async createExercise(
    createExerciseDto: CreateExerciseDto,
    routineId: number,
  ): Promise<Exercise> {
    return this.prisma.exercise.create({
      data: {
        ...createExerciseDto,
        routineId,
      },
    });
  }

  async findAllExercises(routineId: number): Promise<Exercise[]> {
    return this.prisma.exercise.findMany({
      where: { routineId },
    });
  }

  async findOneExercise(id: number, routineId: number): Promise<Exercise> {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id, routineId },
    });
    if (!exercise)
      throw new NotFoundException(`Exercise #${id} not found in this routine`);
    return exercise;
  }

  async updateExercise(
    id: number,
    routineId: number,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    await this.findOneExercise(id, routineId);

    return this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    });
  }

  async removeExercise(id: number, routineId: number): Promise<Exercise> {
    await this.findOneExercise(id, routineId);

    return this.prisma.exercise.delete({
      where: { id },
    });
  }
}
