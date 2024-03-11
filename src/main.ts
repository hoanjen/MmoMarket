import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoggingInterceptor } from './common/interceptors/interceptor.common';
import { HttpExceptionFilter } from './common/exceptions/exceptionsFilter';

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

  const whileList = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:8000',
  ];

  app.enableCors({
    origin: function (origin, callback) {
      if (whileList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        throw new BadRequestException('error');
      }
    },
    credentials: true,
    allowedHeaders:
      'Origin, X-CSRF-TOKEN, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, channel, request-id, Authorization, x-custom-lang',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH',
  });

  //pipe + filter

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(configService.get<number>('app.port'));
}
bootstrap();
