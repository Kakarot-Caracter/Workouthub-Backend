import { Controller, Get, Body, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from '@prisma/client';
import { Auth } from 'src/common/decorators/auth.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Auth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@GetUser() user: User) {
    return await this.userService.findOne(user.id);
  }

  @Patch()
  updateUser(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(user.id, updateUserDto);
  }

  @Delete()
  deleteUser(@GetUser() user: User) {
    return this.userService.deleteUser(user.id);
  }
}
