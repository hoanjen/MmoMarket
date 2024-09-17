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
import { StatusProductSale } from '../product.constant';

export class CreateDataProductDto {
  @ApiProperty({
    example: [
      {
        account: 'acount',
        password: 'password',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Array<ItemDataProductDto>)
  readonly dataProducts: Array<ItemDataProductDto>;

  @IsUUID()
  @ApiProperty({
    example: 'vans_product_id',
    required: true,
  })
  readonly vans_product_id: string;
}

export class ItemDataProductDto {
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
}

export class ItemDataProductBuyDto {
  @ApiProperty({
    example: 'vans_product_id',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  readonly vans_product_id: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'number' ? value : parseInt(value)))
  readonly quantity: number;
}

export class IdVansProductDto {
  @ApiProperty({
    example: 'vans_product_id',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  readonly vans_product_id: string;
}
