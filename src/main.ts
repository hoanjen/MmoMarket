import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoggingInterceptor } from './common/interceptors/interceptor.common';
import { HttpExceptionFilter } from './common/exceptions/exceptionsFilter';
import { RedisIoAdapter } from './modules/gateway/redis-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  //swagger
  const config = new DocumentBuilder()
    .setTitle('Learn setup')
    .setDescription('The learn API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
    const whiteList = configService
      .get<string>('app.whiteList')
      .split(',');
      
  app.enableCors({
    origin: function (origin, callback) {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        throw new BadRequestException('error');
      }
    },
    credentials: true,    
    allowedHeaders:
      'Origin, X-CSRF-TOKEN, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, channel, request-id, Authorization, x-custom-lang ,',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH',
  });
  
  //redis
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  
  app.useWebSocketAdapter(redisIoAdapter);
  //pipe + filter
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(configService.get<number>('app.port'));
}
bootstrap();
