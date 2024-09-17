import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { BuyVansProductDto } from './dtos/buy-vans-product.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderSevice: OrderService) {}

  @ApiOperation({ summary: 'Buy VansProduct' })
  @ApiBearerAuth()
  @Post()
  async buyVansProduct(@Request() req: any, @Body() buyVansProductInput: BuyVansProductDto) {
    return this.orderSevice.createOrder(req, buyVansProductInput);
  }
}
