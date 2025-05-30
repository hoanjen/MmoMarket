import { Body, Controller, Post } from '@nestjs/common';
import { VeryOtpDto } from './dtos/veryotp.dto';
import { SendOtpDto } from './dtos/sendotp.dto';
import { OtpService } from './otp.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/common/decorators/decorator.common';

@ApiTags('Mail')
@Controller('mail')
@IsPublic()
export class OtpController {
  constructor(private readonly mailService: OtpService) {}

  @ApiOperation({ summary: 'Send otp to mail for signup' })
  @Post('send-otp')
  async sendMail(@Body() sendMailInput: SendOtpDto) {
    return this.mailService.sendOtp(sendMailInput);
  }

  @ApiOperation({ summary: 'Send otp to mail normal' })
  @Post('send-otp-normal')
  async sendMailNormal(@Body() sendMailInput: SendOtpDto) {
    return this.mailService.sendOtpNormal(sendMailInput);
  }
}
