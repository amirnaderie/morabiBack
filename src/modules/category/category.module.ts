import { forwardRef, Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { CategoryService } from './providers/category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => AuthModule),
    forwardRef(() => LogModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
