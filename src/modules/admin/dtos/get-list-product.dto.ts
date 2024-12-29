import { ApiProperty } from '@nestjs/swagger';

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
