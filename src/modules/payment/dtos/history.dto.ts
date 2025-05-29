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

export class GetHistoryDto {
  @ApiProperty({
    example: 10,
    required: false,
  })
  @Transform(({ value }) => (typeof value === 'number' ? value : parseInt(value)))
  @IsNumber()
  @IsOptional()
  readonly limit: number;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @Transform(({ value }) => (typeof value === 'number' ? value : parseInt(value)))
  @IsNumber()
  @IsOptional()
  readonly page: number;
}
