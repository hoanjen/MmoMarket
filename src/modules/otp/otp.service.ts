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

@Injectable()
export class OtpService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async veryOtp(veryOtpInput: VeryOtpDto) {
    const { otp, email } = veryOtpInput;
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new BadRequestException('User not exist!!');
    }
    const nowDate = new Date();
    const otpEnity = await this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.otp = :otp AND otp.expired > :nowDate', { otp, nowDate })
      .getOne();
    if (!otpEnity) {
      throw new BadRequestException('Otp is not correct ! or expired');
    }

    await this.otpRepository.delete(otpEnity);

    return ReturnCommon({
      statusCode: HttpStatus.ACCEPTED,
      status: EResponse.SUCCESS,
      message: 'Very email success',
      data: {},
    });
  }

  async sendOtp(sendOtpInput: SendOtpDto) {
    const { email } = sendOtpInput;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Email does not exist !');
    }

    const otp = Math.round(Math.random() * 1000000).toString(10);
    console.log(typeof otp);
    const newOtp = this.otpRepository.create({
      user,
      otp,
      mail_type: 'Very mail',
      expired: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
    });
    console.log(newOtp);
    await this.otpRepository.save(newOtp);
    console.log(1111);
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
