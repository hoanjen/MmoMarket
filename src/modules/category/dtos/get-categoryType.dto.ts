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

export class GetCategoryTypeDto {
  @ApiProperty({
    example: 'Id danh muc',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly category_id: string;
}

export class GetQueryCategoryTypeDto {
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
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  readonly category_type_ids?: Array<string>;
}

export class CategoryTypeParamDto {
  @ApiProperty({
    example: 'id',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
