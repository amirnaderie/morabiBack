import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { Permission } from './entities/permission.entity';
import { PermissionController } from './permission.controller';
import { PermissionService } from './providers/permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    forwardRef(() => AuthModule),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
