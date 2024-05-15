import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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

  @Transform(({ value }) =>
    typeof value === 'number' ? value : parseInt(value),
  )
  @IsNumber()
  @ApiProperty({
    example: '100000',
    default: '0',
    required: false,
  })
  readonly price: number;

  @Transform(({ value }) =>
    typeof value === 'number' ? value : parseInt(value),
  )
  @IsNumber()
  @ApiProperty({
    example: '100',
    default: '1',
    required: false,
  })
  readonly quantity: number;

  @IsUUID()
  @ApiProperty({
    example: 'product_id',
    required: false,
  })
  readonly product_id: string;
}
