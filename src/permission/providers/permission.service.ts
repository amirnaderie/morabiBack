import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import { User } from 'src/users/entities/user.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { Permission } from '../permission.entity';

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
    console.log(name, enName, 'name, enName ');
    const permission = this.permissionRepository.create({
      name: name,
      enName: enName,
    });
    const cretaedPermission = await this.permissionRepository.save(permission);
    return cretaedPermission;
  }

  async updatePermission(
    id: string,
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

  async deletePermission(id: string): Promise<void> {
    const result = await this.permissionRepository.delete({
      id: id,
    });

    if (result.affected === 0)
      throw new NotFoundException(`Permission with Id : ${id} not found`);
  }

  async getPermissionRaw(id: string): Promise<Permission> {
    return await this.permissionRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}
