import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

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

export class OrderId {
  @ApiProperty({
    example: '12214affqraw123',
    required: true,
  })
  @IsUUID()
  readonly order_id: string;
}
