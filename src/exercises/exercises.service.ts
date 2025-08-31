import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkRoutineOwnership(routineId: number, userId: number) {
    const routine = await this.prisma.routine.findUnique({
      where: { id: routineId },
    });
    if (!routine) {
      throw new NotFoundException(`Routine with id #${routineId} not found`);
    }
    if (routine.userId !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to access this routine`,
      );
    }
    return routine;
  }

  async create(
    createExerciseDto: CreateExerciseDto,
    routineId: number,
    userId: number,
  ) {
    await this.checkRoutineOwnership(routineId, userId);
    try {
      const exercise = await this.prisma.exercise.create({
        data: {
          ...createExerciseDto,
          routineId,
        },
      });
      return exercise;
    } catch (error) {
      throw new InternalServerErrorException('Error creating exercise');
    }
  }

  async findAll(routineId: number, userId: number) {
    await this.checkRoutineOwnership(routineId, userId);
    return this.prisma.exercise.findMany({
      where: { routineId },
    });
  }

  async findOne(id: number, routineId: number, userId: number) {
    await this.checkRoutineOwnership(routineId, userId);
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

  async update(
    id: number,
    updateExerciseDto: UpdateExerciseDto,
    routineId: number,
    userId: number,
  ) {
    await this.findOne(id, routineId, userId); // check ownership and existence
    try {
      const updatedExercise = await this.prisma.exercise.update({
        where: { id },
        data: updateExerciseDto,
      });
      return updatedExercise;
    } catch (error) {
      throw new InternalServerErrorException('Error updating exercise');
    }
  }

  async remove(id: number, routineId: number, userId: number) {
    await this.findOne(id, routineId, userId); // check ownership and existence
    try {
      await this.prisma.exercise.delete({
        where: { id },
      });
      return { message: `Exercise with id #${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting exercise');
    }
  }
}
