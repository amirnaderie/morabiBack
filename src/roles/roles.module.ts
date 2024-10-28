import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Roles } from './roles.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './providers/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Roles]), AuthModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
