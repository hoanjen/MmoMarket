import { Body, Controller, Get, Param, Post, Query, Request } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { BuyVansProductDto } from './dtos/buy-vans-product.dto';
import { GetOrdersByMerchantDto, GetOrdersDto } from './dtos/get-orders.dto';
import { RequestAuth } from 'src/common/interface.common';
import { GetOrderDetalDto } from './dtos/get-order-detail.dto';
import { CancelReportOrderDTO, ReportOrderDTO, ReturnMoneyForReportOrderDTO } from './dtos/report-order.dto';

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

  @ApiOperation({ summary: 'Report Order' })
  @ApiBearerAuth()
  @Post('/report')
  async reportOrder(@Request() req: any, @Body() reportOrderInput: ReportOrderDTO) {
    return this.orderSevice.reportOrder(req, reportOrderInput);
  }

  @ApiOperation({ summary: 'Cancel Report Order' })
  @ApiBearerAuth()
  @Post('/cancel-report')
  async cancelReportOrder(@Request() req: any, @Body() cancelReportOrderInput: CancelReportOrderDTO) {
    return this.orderSevice.cancelReportOrder(req, cancelReportOrderInput);
  }

  @ApiOperation({ summary: 'Get Orders By Merchant' })
  @ApiBearerAuth()
  @Get('/orders-merchant')
  async getOrdersByMerchant(@Request() req: RequestAuth, @Query() getOrdersByMerchantInput: GetOrdersByMerchantDto) {
    return this.orderSevice.getOrderByMerchant(req.user.sub, getOrdersByMerchantInput);
  }

  @ApiOperation({ summary: 'Return Orders By Merchant' })
  @ApiBearerAuth()
  @Post('/return-merchant')
  async returnMoneyForReportOrder(
    @Request() req: RequestAuth,
    @Body() returnMoneyForReportOrderInput: ReturnMoneyForReportOrderDTO,
  ) {
    return this.orderSevice.returnMoneyForReportOrder(req.user.sub, returnMoneyForReportOrderInput);
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
