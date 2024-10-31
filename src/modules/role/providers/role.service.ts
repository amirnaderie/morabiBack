import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AssignPermissionToRole, CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PermissionService } from 'src/modules/permission/providers/permission.service';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private permissionService: PermissionService,
  ) {}

  async findOne(id: number) {
    return await this.rolesRepository.findOne({
      where: { id: id },
      relations: {
        permissions: true,
      },
    });
  }
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, enName } = createRoleDto;
    console.log(name, enName, 'name, enName ');
    const roles = this.rolesRepository.create({
      name: name,
      enName: enName,
    });
    const cretaedRole = await this.rolesRepository.save(roles);
    return cretaedRole;
  }

  async assignPermissionToRole(
    assignPermissionToRole: AssignPermissionToRole,
  ): Promise<any> {
    const { roleId, permissionIds } = assignPermissionToRole;

    const permissions =
      await this.permissionService.existPermissionIdsRaw(permissionIds);

    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
    });

    role.permissions = permissions;

    const result = this.rolesRepository.save(role);

    return result;
  }

  async updateRoles(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { name, enName, permissions } = updateRoleDto;
    const p = [];
    // console.log('permissions => ', permissions);
    // console.log('p => ', p);
    const uniquePermission = [...new Set(permissions)];
    console.log('uniquePermission => ', uniquePermission);
    for (let i = 0; i < uniquePermission.length; i++) {
      const per = await this.permissionService.getPermissionRaw(
        parseInt(uniquePermission[i]),
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

  async getRoles(): Promise<Role[]> {
    const roles = await this.rolesRepository.find({
      relations: {
        permissions: true,
      },
    });
    return roles;
  }

  async deleteRoles(id: number): Promise<void> {
    const result = await this.rolesRepository.delete({
      id: id,
    });

    if (result.affected === 0)
      throw new NotFoundException(`role with Id : ${id} not found`);
  }
}
