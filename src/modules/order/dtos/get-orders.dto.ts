import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetOrdersDto {
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
