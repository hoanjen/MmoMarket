import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  isNumber,
} from 'class-validator';

export class CreateVansProductDto {
  @IsString()
  @ApiProperty({
    example: '10',
    required: true,
  })
  readonly title: string;

  @IsString()
  @ApiProperty({
    example: 'description',
    default: 'description',
    required: false,
  })
  readonly description: string;

  @Transform(({ value }) => (typeof value === 'number' ? value : parseInt(value)))
  @IsNumber()
  @ApiProperty({
    example: '100000',
    default: '0',
    required: false,
  })
  readonly price: number;

  @ApiProperty({
    example: '100000',
    default: '1',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly quantity?: number;

  @IsUUID()
  @ApiProperty({
    example: 'product_id',
    required: false,
  })
  readonly product_id: string;
}

export class UpdateVansProductDto {
  @ApiProperty({
    example: '10',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiProperty({
    example: 'description',
    default: 'description',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    example: '100000',
    default: '1',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly quantity?: number;

  @ApiProperty({
    example: '100000',
    default: '0',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly price?: number;
}

export class VanProductParamsDto {
  @ApiProperty({
    example: 'vanId',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;
}
