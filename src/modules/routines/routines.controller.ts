import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

import { User } from '@prisma/client';
import { Auth } from 'src/common/decorators/auth.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('routines')
@Auth()
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  async createRoutine(
    @Body() createRoutineDto: CreateRoutineDto,
    @GetUser() user: User,
  ) {
    const routine = await this.routinesService.createRoutine(
      createRoutineDto,
      user.id,
    );

    return { message: 'Routine created successfully', routine };
  }

  @Get()
  async findAllRoutines(@GetUser() user: User) {
    const routines = await this.routinesService.findAllRoutines(user.id);
    return { message: 'Routines retrieved successfully', routines };
  }

  @Get(':id')
  async findOneRoutine(@Param('id') id: number, @GetUser() user: User) {
    const routine = await this.routinesService.findOneRoutine(+id, user.id);
    return { message: 'Routine retrieved successfully', routine };
  }

  @Patch(':id')
  async updateRoutine(
    @Param('id') id: number,
    @Body() updateRoutineDto: UpdateRoutineDto,
    @GetUser() user: User,
  ) {
    const routine = await this.routinesService.updateRoutine(
      +id,
      updateRoutineDto,
      user.id,
    );
    return { message: 'Routine updated successfully', routine };
  }

  @Delete(':id')
  async removeRoutine(@Param('id') id: number, @GetUser() user: User) {
    await this.routinesService.removeRoutine(+id, user.id);
    return { message: 'Routine deleted successfully' };
  }
}
