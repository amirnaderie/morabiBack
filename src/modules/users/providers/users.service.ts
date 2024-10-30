import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RolesService } from 'src/modules/role/providers/role.service';
import { AssginUserRoleDto } from '../dto/assign-user-roles.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // You can inject without using forFeature()
    private readonly userRepository: Repository<User>,
    private rolesServise: RolesService,
  ) {}
  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUserByMobile(userMobile: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ userMobile });
    return user;
  }

  async assginRole(assginUserRoleDto: AssginUserRoleDto): Promise<User> {
    try {
      console.log('dddd');

      const { userId, roleId } = assginUserRoleDto;

      const user = await this.findOne(userId);
      const role = await this.rolesServise.findOne(roleId);
      console.log(user.roles, 'user.roles');
      user.roles = [role];

      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error, 'error');
    }
  }
}
