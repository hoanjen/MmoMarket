import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderService } from '../order/order.service';

@Injectable()
export class WorkerService {
  constructor(private readonly orderService: OrderService) {}
  private readonly logger = new Logger(WorkerService.name);
  @Cron(CronExpression.EVERY_HOUR)
  handleHourlyTask() {
    this.logger.debug('Task executed every hour');
    this.orderService.updateOrderFreeze();
  }
}
