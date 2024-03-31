import { Body, Controller, Post } from '@nestjs/common';
import { VeryOtpDto } from './dtos/veryotp.dto';
import { SendOtpDto } from './dtos/sendotp.dto';
import { OtpService } from './otp.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Mail')
@Controller('mail')
export class OtpController {
  constructor(private readonly mailService: OtpService) {}

  @ApiOperation({ summary: 'Very Otp' })
  @Post('very-otp')
  async veryMail(@Body() veryMailInput: VeryOtpDto): Promise<any> {
    return this.mailService.veryOtp(veryMailInput);
  }

  @ApiOperation({ summary: 'Send otp to mail' })
  @Post('send-otp')
  async sendMail(@Body() sendMailInput: SendOtpDto) {
    return this.mailService.sendOtp(sendMailInput);
  }
}
