import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  async createExercise(
    createExerciseDto: CreateExerciseDto,
    routineId: number,
  ) {
    const exercise = await this.prisma.exercise.create({
      data: {
        ...createExerciseDto,
        routineId,
      },
    });

    return exercise;
  }

  async findAllExercises(routineId: number) {
    return this.prisma.exercise.findMany({
      where: { routineId },
    });
  }

  async findOneExercise(id: number, routineId: number) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id, routineId },
    });

    if (!exercise) {
      throw new NotFoundException(
        `Exercise with id #${id} not found in this routine`,
      );
    }
    return exercise;
  }

  async updateExercise(id: number, updateExerciseDto: UpdateExerciseDto) {
    const updatedExercise = await this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    });
    return updatedExercise;
  }

  async removeExercise(id: number, routineId: number) {
    await this.findOneExercise(id, routineId); // check ownership and existence

    const deletedExercise = await this.prisma.exercise.delete({
      where: { id },
    });

    return deletedExercise;
  }
}
