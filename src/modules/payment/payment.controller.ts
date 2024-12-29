import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreateOrderDto, VerifyDepositDto } from './dtos/deposit.dto';
import { RequestAuth } from 'src/common/interface.common';

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
}
