import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
      select: {
        id: true,
        email: true,
        username: true,
        height: true,
        age: true,
        weight: true,
        gender: true,
        weeklyActivity: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        height: true,
        age: true,
        weight: true,
        gender: true,
        weeklyActivity: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException(`User with id #${id} not found`);
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const data = { ...updateUserDto };
    if (updateUserDto.password)
      data.password = await bcrypt.hash(updateUserDto.password, 10);

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: number) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        height: true,
        age: true,
        weight: true,
        gender: true,
        weeklyActivity: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
