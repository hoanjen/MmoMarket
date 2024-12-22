import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/entity/order.entity';
import { User } from '../user/entity/user.entity';
import { Product } from '../product/entity/product.entity';
import { Category } from '../category/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product, Category])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
