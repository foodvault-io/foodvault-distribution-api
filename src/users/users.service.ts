import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        hashedPassword: createUserDto.password,
      }
    });

    return user;
  }

  async findAll(): Promise<Partial<User>[] | undefined> {
    const users = await this.prisma.user.findMany();

    for (const user of users) {
      delete user.hashedPassword;
    }

    return users;
  }

  async findOneById(id: string): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.hashedPassword) {
      delete user.hashedPassword;
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.hashedPassword) {
      delete user.hashedPassword;
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
