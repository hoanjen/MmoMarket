import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @ApiProperty({
    example: 'Title',
  })
  @IsOptional()
  readonly title?: string;

  @ApiProperty({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  readonly minPrice?: number;

  @ApiProperty({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  readonly maxPrice?: number;

  @IsString()
  @ApiProperty({
    example: 'Sub title',
  })
  @IsOptional()
  readonly sub_title?: string;

  @IsString()
  @ApiProperty({
    example: 'description',
  })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    example: 'https://www.facebook.com/hoanjennn',
  })
  @IsOptional()
  @Transform(({ value }) => value) // To handle file upload
  readonly image?: string;
}
