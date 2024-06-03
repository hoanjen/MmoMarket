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

export class GetCategoryTypeDto {
  @ApiProperty({
    example: 'Id danh muc',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly category_id: string;
}
