import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AlsModule } from 'src/middleware/als.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule),AlsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule,UsersService]
})
export class UsersModule {}
