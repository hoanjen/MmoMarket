import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetListProductDto {
  @ApiProperty({
    example: 'search',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}

export class GetHistoryDto {
  @ApiProperty({
    example: 10,
    required: false,
  })
  @Transform(({ value }) => (typeof value === 'number' ? value : parseInt(value)))
  @IsNumber()
  @IsOptional()
  readonly limit: number;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @Transform(({ value }) => (typeof value === 'number' ? value : parseInt(value)))
  @IsNumber()
  @IsOptional()
  readonly page: number;
}
