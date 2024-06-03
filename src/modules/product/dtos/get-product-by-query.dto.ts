import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
} from 'class-validator';
import { SortBy } from '../product.constant';

export class GetProductByQueryDto {
  @ApiProperty({
    example: 'Id of category',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  readonly category_id: string;

  @ApiProperty({
    required: false,
  })
  @IsArray()
  @IsOptional()
  readonly category_type_ids?: Array<string>;

  @ApiProperty({
    example: 'Search with name product',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly keyword: string;

  @ApiProperty({
    example: 10,
    required: false,
  })
  @Transform(({ value }) =>
    typeof value === 'number' ? value : parseInt(value),
  )
  @IsNumber()
  @IsOptional()
  readonly limit: number;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @Transform(({ value }) =>
    typeof value === 'number' ? value : parseInt(value),
  )
  @IsNumber()
  @IsOptional()
  readonly page: number;

  @ApiProperty({
    example: SortBy.TRENDING,
    required: false,
  })
  @IsEnum(SortBy)
  @IsOptional()
  readonly sortBy: SortBy;
}
