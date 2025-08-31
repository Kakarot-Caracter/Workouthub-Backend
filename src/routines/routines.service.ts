import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoutinesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoutineDto: CreateRoutineDto, userId: number) {
    const newRoutine = await this.prisma.routine.create({
      data: {
        ...createRoutineDto,
        userId,
      },
    });
    return newRoutine;
  }

  async findAll(userId: number) {
    return this.prisma.routine.findMany({
      where: { userId },
    });
  }

  async findOne(id: number, userId: number) {
    const routine = await this.prisma.routine.findFirst({
      where: { id, userId },
    });
    if (!routine) throw new NotFoundException(`Routine #${id} not found`);
    return routine;
  }

  async update(id: number, updateRoutineDto: UpdateRoutineDto, userId: number) {
    // Aseguramos que la rutina existe y pertenece al usuario
    const routine = await this.findOne(id, userId);

    return this.prisma.routine.update({
      where: { id: routine.id },
      data: updateRoutineDto,
    });
  }

  async remove(id: number, userId: number) {
    // Aseguramos que la rutina existe y pertenece al usuario
    const routine = await this.findOne(id, userId);

    return this.prisma.routine.delete({
      where: { id: routine.id },
    });
  }
}
