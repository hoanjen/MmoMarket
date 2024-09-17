import { ParseIntPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty({
    example: 'Title',
  })
  readonly title: string;

  @IsString()
  @ApiProperty({
    example: 'Sub title',
  })
  readonly sub_title: string;

  @IsString()
  @ApiProperty({
    example: 'description',
  })
  readonly description: string;

  @IsUUID()
  @ApiProperty({
    example: 'category_type_id',
  })
  readonly category_type_id: string;

  @ApiProperty({
    example: 'https://www.facebook.com/hoanjennn',
  })
  @IsOptional()
  @Transform(({ value }) => value || null) // To handle file upload
  readonly image?: string;
}
