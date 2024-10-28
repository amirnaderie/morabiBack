import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import { User } from 'src/users/entities/user.entity';
import { CreateRoleDto } from '../dto/create-roles.dto';
import { Roles } from '../roles.entity';
import { UpdateRoleDto } from '../dto/update-roles.dto';
import { PermissionService } from 'src/modules/permission/providers/permission.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    private permissionService: PermissionService,
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

  async updateRoles(id: string, updateRoleDto: UpdateRoleDto): Promise<Roles> {
    const { name, enName, permissions } = updateRoleDto;
    const p = [];
    console.log('permissions => ', permissions);
    console.log('p => ', p);
    const uniquePermission = [...new Set(permissions)];
    console.log('uniquePermission => ', uniquePermission);
    for (let i = 0; i < uniquePermission.length; i++) {
      const per = await this.permissionService.getPermissionRaw(
        uniquePermission[i],
      );
      console.log(per, 'per');
      if (per) p.push(per);
    }

    console.log(p);

    const role = await this.rolesRepository.findOne({
      where: { id: id },
    });

    role.permissions = p;

    const roles = await this.rolesRepository.save({
      ...role,
      name: name,
      enName: enName,
    });

    return roles;
  }

  async getRoles(): Promise<Roles[]> {
    const roles = await this.rolesRepository.find({
      relations: {
        permissions: true,
      },
    });
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
