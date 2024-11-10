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
  ): Promise<Permission> {
    const { name, enName } = createPermissionDto;
    const permission = this.permissionRepository.create({
      name: name,
      enName: enName,
    });
    const cretaedPermission = await this.permissionRepository.save(permission);
    return cretaedPermission;
  }

  async updatePermission(
    id: number,
    updatePermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    const { name, enName } = updatePermissionDto;

    const permission = await this.permissionRepository.findOne({
      where: { id: id },
    });

    const result = await this.permissionRepository.save({
      ...permission,
      name: name,
      enName: enName,
    });

    return result;
  }

  async getPermission(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async deletePermission(id: number): Promise<void> {
    const result = await this.permissionRepository.delete({
      id: id,
    });

    if (result.affected === 0)
      throw new NotFoundException(`Permission with Id : ${id} not found`);
  }

  async getPermissionRaw(id: number): Promise<Permission> {
    return await this.permissionRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async existPermissionIdsRaw(ids: string[]): Promise<Permission[]> {
    try {
      return await this.permissionRepository.find({
        where: { id: In([...ids]) },
      });
    } catch (error) {
      throw new NotFoundException('permission not found', error);
    }
  }
}
