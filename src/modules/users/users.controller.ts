import { User } from './entities/user.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersService } from './providers/users.service';
import { UserResponseDto } from './dto/response/userResponse.dto';
import { AssginUserRoleDto } from './dto/assign-user-roles.dto';
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create() {
    return this.usersService.create();
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  @Get('/me')
  me(
    @GetUser() user: User & { permissions: string[] },
  ): UserResponseDto & { permissions: string[] } {
    return {
      // userName: user.userName,
      id: user.id,
      roles: user.roles,
      permissions: user.permissions,
      realmId: user.realmId,
    };
  }

  @Post('/assgin-role')
  assginRole(
    @Body() assginUserRoleDto: AssginUserRoleDto,
    @Req() req: Request,
  ): any {
    return this.usersService.assginRole(assginUserRoleDto, req);
  }
}
