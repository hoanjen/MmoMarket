import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StatusProductSale } from '../product.constant';

export class CreateDataProductDto {
  @IsString()
  @ApiProperty({
    example: 'account',
    required: true,
  })
  readonly account: string;

  @IsString()
  @ApiProperty({
    example: 'password',
    default: 'password',
    required: true,
  })
  readonly password: string;

  @IsString()
  @ApiProperty({
    example: StatusProductSale.NOTSOLD,
    default: StatusProductSale.NOTSOLD,
    required: false,
  })
  readonly status: StatusProductSale;

  @IsUUID()
  @ApiProperty({
    example: 'vans_product_id',
    required: true,
  })
  readonly vans_product_id: string;
}
