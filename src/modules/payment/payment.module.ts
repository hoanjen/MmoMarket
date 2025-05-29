import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './entity/balance.entity';
import { Transaction } from './entity/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Balance, Transaction])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
