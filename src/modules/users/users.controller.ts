import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/modules/auth/get-user.decorator';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/response/userResponse.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
// import { RolesGuard } from 'src/modules/auth/role.guard';
import { AssginUserRoleDto } from './dto/assign-user-roles.dto';
import { UsersService } from './providers/users.service';

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
  me(@GetUser() user: User): UserResponseDto {
    return {
      userName: user.userName,
      id: user.id,
      roles: user.roles,
    };
  }

  @Post('/assgin-role')
  assginRole(@Body() assginUserRoleDto: AssginUserRoleDto): any {
    console.log(655, assginUserRoleDto);
    return this.usersService.assginRole(assginUserRoleDto);
  }
}
