import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { OrderModule } from '../order/order.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), OrderModule],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
