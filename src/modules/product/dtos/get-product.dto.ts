import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class GetProductDto {

  @Transform(({ value }) =>
    typeof value === 'number' ? value : parseInt(value),
  )
  @IsNumber()
  @ApiProperty({
    example: '10',
    required: false,
  })
  readonly limit: number;

  @Transform(({ value }) =>
    typeof value === 'number' ? value : parseInt(value),
  )
  @IsNumber()
  @ApiProperty({
    example: '1',
    required: false,
  })
  readonly page: number;


  @ApiProperty({
    example: 'vansProduct',
    required: false,
  })
  readonly populate: string;
}
