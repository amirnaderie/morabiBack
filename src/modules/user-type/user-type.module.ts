import { UserType } from './entities/user-type.entity';
import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeService } from './user-type.service';
import { UserTypeController } from './user-type.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserType]),
    forwardRef(() => AuthModule),
    forwardRef(() => LogModule),
  ],
  controllers: [UserTypeController],
  providers: [UserTypeService],
  exports: [UserTypeService],
})
export class UserTypeModule {}
