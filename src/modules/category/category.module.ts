import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoryType } from './entity/category-type.entity';
import { ProductModule } from '../product/product.module';
// import { Product } from '../product/enity/product.enity';
import { CategoryTypeController } from './category-type.controller';
import { CategoryTypeService } from './category-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryType])],
  controllers: [CategoryController, CategoryTypeController],
  providers: [CategoryService, CategoryTypeService],
  exports: [CategoryService, CategoryTypeService],
})
export class CategoryModule {}
