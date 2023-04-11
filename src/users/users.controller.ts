import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCurrentUserId, Public } from '../common/decorators';
import { ACGuard, InjectRolesBuilder, RolesBuilder, UseRoles } from 'nest-access-control';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  loggin: Logger = new Logger('UsersController');

  constructor(
    private readonly usersService: UsersService,
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder,
  ) { }

  
  @Get()
  @Public()
  findAll() {
    this.loggin.debug('All Users');
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'user',
    action: 'read',
    possession: 'any',
  })
  async findOneById(
    @Param('id') id: string,
  ) {
    this.loggin.debug('User by id: ' + id);
    return await this.usersService.findOneById(id);
  }

  @Get('/get/me')
  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'user',
    action: 'read',
    possession: 'own',
  })
  async username(
    @GetCurrentUserId() id: string,
  ) {
    this.loggin.debug('LoggedIn User by id: ' + id);
    return await this.usersService.findOneById(id);
  }

  @UseGuards(ACGuard)
  @UseRoles({
    resource: 'user',
    action: 'read',
    possession: 'any',
  })
  @Get('/email/:email')
  async findOneByEmail(
    @Param('email') email: string,
  ) {
    this.loggin.debug('User by email: ' + email);
    return await this.usersService.findOneByEmail(email);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
