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
  isUUID,
} from 'class-validator';

export class GetVansProductDto {
  @ApiProperty({
    example: 'vans_product_id',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  readonly vans_product_id: string;
}


