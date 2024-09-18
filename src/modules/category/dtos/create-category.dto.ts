import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TypeCategory } from '../category.constant';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Danh muc',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: TypeCategory.PRODUCT,
  })
  @IsEnum(TypeCategory)
  @IsNotEmpty()
  readonly type: TypeCategory;
}
