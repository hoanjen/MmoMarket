import { Body, Controller, Get, Param, Post, Query, Request } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { BuyVansProductDto } from './dtos/buy-vans-product.dto';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { RequestAuth } from 'src/common/interface.common';
import { GetOrderDetalDto } from './dtos/get-order-detail.dto';

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

  @ApiOperation({ summary: 'Get Orders by token' })
  @ApiBearerAuth()
  @Get()
  async getOrders(@Request() req: RequestAuth, @Query() getOrdersInput: GetOrdersDto) {
    return this.orderSevice.getOrders(req, getOrdersInput);
  }

  @ApiOperation({ summary: 'Get Order Detail' })
  @ApiBearerAuth()
  @Get(':order_id')
  async getOrderDetail(@Request() req: RequestAuth, @Param() getOrderDetailInput: GetOrderDetalDto) {
    return this.orderSevice.getOrderDetail(req, getOrderDetailInput);
  }
}
