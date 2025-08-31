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
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('routines')
@Auth()
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  async create(
    @Body() createRoutineDto: CreateRoutineDto,
    @GetUser() user: User,
  ) {
    const routine = await this.routinesService.create(
      createRoutineDto,
      user.id,
    );
    return { message: 'Routine created successfully', routine };
  }

  @Get()
  async findAll(@GetUser() user: User) {
    const routines = await this.routinesService.findAll(user.id);
    return { message: 'Routines retrieved successfully', routines };
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @GetUser() user: User) {
    const routine = await this.routinesService.findOne(+id, user.id);
    return { message: 'Routine retrieved successfully', routine };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRoutineDto: UpdateRoutineDto,
    @GetUser() user: User,
  ) {
    const routine = await this.routinesService.update(
      +id,
      updateRoutineDto,
      user.id,
    );
    return { message: 'Routine updated successfully', routine };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: User) {
    await this.routinesService.remove(+id, user.id);
    return { message: 'Routine deleted successfully' };
  }
}
