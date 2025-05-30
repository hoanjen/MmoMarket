import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entity/discount.entity';
import { Order } from './entity/order.entity';
import { DataProductOrder } from './entity/data-product-order.entity';
import { ProductModule } from '../product/product.module';
import { Freeze } from './entity/freeze.entity';
import { Report } from './entity/report.entity';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discount, Order, DataProductOrder, Freeze, Report]),
    ProductModule,
    PaymentModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
