import { ParseIntPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

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

  @IsString()
  @ApiProperty({
    example:
      'https://scontent.fhan3-1.fna.fbcdn.net/v/t1.6435-9/72072531_609163749915149_3233622757660950528_n.jpg',
  })
  image: string;
}
