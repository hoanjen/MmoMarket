import { ParseIntPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 10,
  })
  @Transform(({ value }) => (typeof value === 'number' ? value : parseInt(value)))
  @Type(() => Number)
  readonly amount: number;

  @ApiProperty({
    example: 'CAPTURE',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value : String(value)))
  @Type(() => String)
  readonly intent: string;
}

export class VerifyDepositDto {
  @IsString()
  @ApiProperty({
    example: 'order_id',
  })
  readonly order_id: string;
}
