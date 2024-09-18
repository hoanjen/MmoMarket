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
  ValidateNested,
} from 'class-validator';

export class BuyVansProductDto {
  @ApiProperty({
    example: 'id vans product',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly vans_product_id: string;

  @Transform(({ value }) => (typeof value === 'number' ? value : parseInt(value)))
  @ApiProperty({
    example: 'quantity',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;

  readonly discount_id?: string;
}
