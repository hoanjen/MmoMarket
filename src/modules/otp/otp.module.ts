import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entity/otp.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp, User]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'lew2k3@gmail.com',
            pass: 'yfqkpiwzbuqfgtbk',
          },
        },
        defaults: {
          from: process.env.EMAIL_USER,
        },
        // preview: true,
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpModule],
})
export class OtpModule {}
