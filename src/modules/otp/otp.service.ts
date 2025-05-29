import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { VeryOtpDto } from './dtos/veryotp.dto';
import { SendOtpDto } from './dtos/sendotp.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Otp } from './entity/otp.entity';
import { User } from '../user/entity/user.entity';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisCacheService } from '../cache/redis-cache.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async veryOtp(email: string, otp: number) {
    const otpCache = await this.redisCacheService.get(`otp:${email}`);
    if (!otpCache) {
      throw new BadRequestException('Otp hết hạn');
    }

    if (parseInt(otpCache as string) !== otp) {
      throw new BadRequestException('Otp không đúng');
    }

    await this.redisCacheService.del(`otp:${email}`);

    return true;
  }

  async sendOtp(sendOtpInput: SendOtpDto) {
    const { email } = sendOtpInput;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new BadRequestException('Email exist !');
    }

    const otp = Math.round(Math.random() * 1000000).toString(10);

    await this.redisCacheService.set(`otp:${email}`, otp, 300);
    await this.mailerService.sendMail({
      to: sendOtpInput.email, // list of receivers
      from: process.env.MAIL_USER, // sender address
      subject: 'OTP', // Subject line
      template: './sendMail.hbs',
      context: {
        otp: otp,
        url: 'iahdiahdi',
      },
    });
    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: {},
      message: 'Send mail success, check your mail !!',
    });
  }
}
