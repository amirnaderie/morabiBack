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

  async findOne(id: number, req: Request) {
    return await this.rolesRepository.findOne({
      where: { id: id, realmId: (req as any).subdomainId },
      relations: {
        permissions: true,
      },
    });
  }
  async createRole(createRoleDto: CreateRoleDto, req: Request): Promise<Role> {
    const { name, enName } = createRoleDto;
    const roles = this.rolesRepository.create({
      name: name,
      enName: enName,
      realmId: (req as any).subdomainId,
    });
    const cretaedRole = await this.rolesRepository.save(roles);
    return cretaedRole;
  }

  async assignPermissionToRole(
    assignPermissionToRole: AssignPermissionToRole,
    req: Request,
  ): Promise<any> {
    const { roleId, permissionIds } = assignPermissionToRole;

    const permissions = await this.permissionService.existPermissionIdsRaw(
      permissionIds,
      req,
    );

    const role = await this.rolesRepository.findOne({
      where: { id: roleId, realmId: (req as any).subdomainId },
    });

    role.permissions = permissions;

    const result = this.rolesRepository.save(role);

    return result;
  }

  async updateRoles(
    id: number,
    updateRoleDto: UpdateRoleDto,
    req: Request,
  ): Promise<Role> {
    const { name, enName, permissions } = updateRoleDto;
    const p = [];
    const uniquePermission = [...new Set(permissions)];
    for (let i = 0; i < uniquePermission.length; i++) {
      const per = await this.permissionService.getPermissionRaw(
        parseInt(uniquePermission[i]),
        req,
      );
      if (per) p.push(per);
    }

    const role = await this.rolesRepository.findOne({
      where: { id: id, realmId: (req as any).subdomainId },
    });

    role.permissions = p;

    const roles = await this.rolesRepository.save({
      ...role,
      name: name,
      enName: enName,
    });

    return roles;
  }

  async getRoles(req: Request): Promise<Role[]> {
    const roles = await this.rolesRepository.find({
      where: { realmId: (req as any).subdomainId },
      relations: {
        permissions: true,
      },
    });
    return roles;
  }

  async deleteRoles(id: number, req: Request): Promise<void> {
    const result = await this.rolesRepository.delete({
      id: id,
      realmId: (req as any).subdomainId,
    });

    if (result.affected === 0)
      throw new NotFoundException(`role with Id : ${id} not found`);
  }
}
