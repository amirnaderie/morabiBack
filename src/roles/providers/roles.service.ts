import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import { User } from 'src/users/entities/user.entity';
import { CreateRoleDto } from '../dto/create-roles.dto';
import { Roles } from '../roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Roles> {
    const { name, enName } = createRoleDto;
    console.log(name, enName, 'name, enName ');
    const roles = this.rolesRepository.create({
      name: name,
      enName: enName,
    });
    const cretaedRole = await this.rolesRepository.save(roles);
    return cretaedRole;
  }

  async updateRoles(id: string, updateRoleDto: CreateRoleDto): Promise<Roles> {
    const { name, enName } = updateRoleDto;

    const role = await this.rolesRepository.findOne({
      where: { id: id },
    });

    const roles = await this.rolesRepository.save({
      ...role,
      name: name,
      enName: enName,
    });

    return roles;
  }

  async getRoles(): Promise<Roles[]> {
    const roles = await this.rolesRepository.find();
    return roles;
  }

  async deleteRoles(id: string): Promise<void> {
    const result = await this.rolesRepository.delete({
      id: id,
    });

    if (result.affected === 0)
      throw new NotFoundException(`role with Id : ${id} not found`);
  }
}
