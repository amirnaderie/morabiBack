import { LogModule } from '../log/log.module';
import { GymMember } from './entities/gym-member.entity';
import { AuthModule } from '../auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeService } from './gym-member.service';
import { UserTypeController } from './gym-member.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([GymMember]),
    forwardRef(() => AuthModule),
    forwardRef(() => LogModule),
  ],
  controllers: [UserTypeController],
  providers: [UserTypeService],
  exports: [UserTypeService],
})
export class UserTypeModule {}
