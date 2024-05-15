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
    example: [
      {
        vans_product_id: 'id vans product',
        quantity: 'quantity',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Array<ItemOrderDto>)
  readonly orders: Array<ItemOrderDto>;

  @ApiProperty({
    example: 'abcdefgh',
  })
  
  readonly discount_id?: string;
}

export class ItemOrderDto {

  @ApiProperty({
    example: 'id vans product',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly vans_product_id: string;

  @Transform(({ value }) =>
    typeof value === 'number' ? value : parseInt(value),
  )
  @ApiProperty({
    example: 'quantity',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;

}