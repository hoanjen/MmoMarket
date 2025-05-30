import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryType } from '../category/entity/category-type.entity';
import { User } from '../user/entity/user.entity';
import { VansProduct } from './entity/vans-product.entity';
import { Product } from './entity/product.entity';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';
import { VansProductController } from './vans-product/vans-product.controller';
import { VansProductService } from './vans-product/vans-product.service';
import { DataProduct } from './entity/data-product.entity';
import { DataProductController } from './data-product/data-product.controller';
import { DataProductService } from './data-product/data-product.service';

@Module({
  imports: [
    CategoryModule,
    UserModule,
    TypeOrmModule.forFeature([Product, CategoryType, User, VansProduct, DataProduct]),
  ],
  controllers: [ProductController, VansProductController, DataProductController],
  providers: [ProductService, VansProductService, DataProductService],
  exports: [ProductService, VansProductService],
})
export class ProductModule {}
