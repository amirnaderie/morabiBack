import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

// import { User } from 'src/users/entities/user.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async createPermission(
    createPermissionDto: CreatePermissionDto,
    req: Request,
  ): Promise<Permission> {
    const { name, enName } = createPermissionDto;
    const permission = this.permissionRepository.create({
      name: name,
      enName: enName,
      realmId: (req as any).subdomainId,
    });
    const cretaedPermission = await this.permissionRepository.save(permission);
    return cretaedPermission;
  }

  async updatePermission(
    id: number,
    updatePermissionDto: CreatePermissionDto,
    req: Request,
  ): Promise<Permission> {
    const { name, enName } = updatePermissionDto;

    const permission = await this.permissionRepository.findOne({
      where: { id: id, realmId: (req as any).subdomainId },
    });

    const result = await this.permissionRepository.save({
      ...permission,
      name: name,
      enName: enName,
      realmId: (req as any).subdomainId,
    });

    return result;
  }

  async getPermission(req: Request): Promise<Permission[]> {
    return await this.permissionRepository.find({
      where: { realmId: (req as any).subdomainId },
    });
  }

  async deletePermission(id: number, req: Request): Promise<void> {
    const result = await this.permissionRepository.delete({
      id: id,
      realmId: (req as any).subdomainId,
    });

    if (result.affected === 0)
      throw new NotFoundException(`Permission with Id : ${id} not found`);
  }

  async getPermissionRaw(id: number, req: Request): Promise<Permission> {
    return await this.permissionRepository.findOne({
      where: {
        id: id,
        realmId: (req as any).subdomainId,
      },
    });
  }

  async existPermissionIdsRaw(
    ids: string[],
    req: Request,
  ): Promise<Permission[]> {
    try {
      return await this.permissionRepository.find({
        where: { id: In([...ids]), realmId: (req as any).subdomainId },
      });
    } catch (error) {
      throw new NotFoundException('permission not found', error);
    }
  }
}
