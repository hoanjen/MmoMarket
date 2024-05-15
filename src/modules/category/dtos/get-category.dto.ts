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

export class GetCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '0df1762f-685d-48af-b646-863ce4303b7d',
    required: false,
  })
  readonly category_id: string;

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

  @IsString()
  @ApiProperty({
    example: 'CategoryType',
    required: false,
  })
  readonly populate: string;
}
