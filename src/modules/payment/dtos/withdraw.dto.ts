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

export class CreateWithdrawDto {
  @ApiProperty({
    example: 10,
  })
  @Transform(({ value }) => (typeof value === 'number' ? value : parseInt(value)))
  @Type(() => Number)
  readonly amount: number;

  @ApiProperty({
    example: 'EMAIL',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value : String(value)))
  readonly paypal_email: string;
}
