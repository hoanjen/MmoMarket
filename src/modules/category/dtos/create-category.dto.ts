import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
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

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Danh muc',
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    example: TypeCategory.PRODUCT,
  })
  @IsEnum(TypeCategory)
  @IsOptional()
  readonly type?: TypeCategory;
}

export class CategoryParamDto {
  @ApiProperty({
    example: 'id',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
