import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import appConfig from './config/app.config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigExport } from './config/database/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { OtpModule } from './modules/otp/otp.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { UploadModule } from './modules/upload/upload.module';
import { OrderModule } from './modules/order/order.module';
import { CommentModule } from './modules/comment/comment.module';
import { PaymentModule } from './modules/payment/payment.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { ChatModule } from './modules/chat/chat.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [appConfig],
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(DatabaseConfigExport),
    UserModule,
    AuthModule,
    OtpModule,
    CategoryModule,
    ProductModule,
    UploadModule,
    OrderModule,
    CommentModule,
    PaymentModule,
    GatewayModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
