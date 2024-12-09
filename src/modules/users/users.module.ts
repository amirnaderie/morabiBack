import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RolesModule } from '../role/role.module';
import { UsersService } from './providers/users.service';
import { ProfileController } from './profile.controller';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './providers/profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    forwardRef(() => AuthModule),
    RolesModule,
  ],
  controllers: [UsersController, ProfileController],
  providers: [UsersService, ProfileService],
  exports: [TypeOrmModule, UsersService, ProfileService],
})
export class UsersModule {}
