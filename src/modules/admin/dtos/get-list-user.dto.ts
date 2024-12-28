import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetListUserDto {
  @ApiProperty({
    example: 'search',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}
