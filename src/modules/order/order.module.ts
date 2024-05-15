import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entity/discount.entity';
import { Order } from './entity/order.entity';
import { OrderDetail } from './entity/order-detail.entity';
import { DataProductOrder } from './entity/data-product-order.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Discount,Order,OrderDetail,DataProductOrder]),ProductModule],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
