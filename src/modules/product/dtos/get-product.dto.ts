import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
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

export class GetProductDetailDto {
  @ApiProperty({
    example: 'product_id',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  readonly product_id: string;
}
