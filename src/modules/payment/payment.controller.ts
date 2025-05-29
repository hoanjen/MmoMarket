import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreateOrderDto, VerifyDepositDto } from './dtos/deposit.dto';
import { RequestAuth } from 'src/common/interface.common';
import { GetHistoryDto } from './dtos/history.dto';
import { CreateWithdrawDto } from './dtos/withdraw.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Create order paypal' })
  @Post('/create-order')
  async createOrder(@Body() createOrderInput: CreateOrderDto, @Req() req: RequestAuth) {
    return this.paymentService.createOrder(createOrderInput, req);
  }

  @ApiOperation({ summary: 'Capture order paypal' })
  @Post('/capture-order')
  async captureOrder(@Body() verifyDepositInput: VerifyDepositDto, @Req() req: RequestAuth) {
    return this.paymentService.veryDeposit(verifyDepositInput, req);
  }

  @ApiOperation({ summary: 'Get History by token' })
  @Get('/history')
  async getHistoryByToken(@Req() req: RequestAuth, @Query() getHistoryInput: GetHistoryDto) {
    return this.paymentService.getHistory(req, getHistoryInput);
  }

  @ApiOperation({ summary: 'Withdraw by user' })
  @Post('/withdraw')
  async withdrawPaypayByUser(@Req() req: RequestAuth, @Body() createWithdrawInput: CreateWithdrawDto) {
    return this.paymentService.withdrawPaypayByUser(req, createWithdrawInput);
  }
}
