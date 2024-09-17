import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryTypeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Ten danh muc type',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'Id danh muc',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly category_id: string;
}
