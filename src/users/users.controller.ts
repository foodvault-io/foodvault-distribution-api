import { Controller, Get, Body, Patch, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUser, Public } from '../common/decorators';
import { ACGuard, InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { JwtPayload } from 'src/auth/types';

const resource = 'user';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder,
  ) { }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'All users',
    type: [CreateUserDto],
  })
  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: CreateUserDto,
  })
  @Get(':id')
  @UseGuards(ACGuard)
  async findOneById(
    @Param('id') id: string,
    @GetCurrentUser() user: JwtPayload,
  ) {
    if (this.roleBuilder.can(user.roles).readAny(resource).granted) {
      return await this.usersService.findOneById(id);
    } else {
      if (user.userId === id) {
        return await this.usersService.findOneById(id);
      } else {
        throw new ForbiddenException('You are not allowed to access this resource');
      }
    }  
  }

  @ApiOperation({ summary: 'Get a user by email' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: CreateUserDto,
  })
  @UseGuards(ACGuard)
  @Get('/email/:email')
  async findOneByEmail(
    @Param('email') email: string,
    @GetCurrentUser() user: JwtPayload,
  ) {
    if (this.roleBuilder.can(user.roles).readAny(resource).granted) {
      return await this.usersService.findOneByEmail(email);
    } else {
      if (user.email === email) {
        return await this.usersService.findOneByEmail(email);
      } else {
        throw new ForbiddenException('You are not allowed to access this resource');
      }
    }
  }

  @ApiOperation({ summary: 'Update a user by id' })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UpdateUserDto,
  })
  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    type: String,
  })
  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
