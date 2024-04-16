import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './enity/category.entity';
import { CategoryType } from './enity/category-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryType])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
