import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RolesController } from './role.controller';
import { RolesService } from './providers/role.service';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { Role } from './role.entity';
// import { Permission } from 'src/permission/permission.entity';
// import { PermissionService } from 'src/permission/providers/permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    forwardRef(() => AuthModule),
    forwardRef(() => PermissionModule),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
