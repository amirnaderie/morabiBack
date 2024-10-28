import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { Roles } from './roles.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './providers/roles.service';
import { PermissionModule } from 'src/modules/permission/permission.module';
// import { Permission } from 'src/permission/permission.entity';
// import { PermissionService } from 'src/permission/providers/permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roles]),
    forwardRef(() => AuthModule),
    forwardRef(() => PermissionModule),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
