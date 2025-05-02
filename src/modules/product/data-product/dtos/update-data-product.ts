import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDataProductDto {
  @IsString()
  @ApiProperty({
    example: 'account',
  })
  @IsOptional()
  readonly account?: string;

  @IsString()
  @ApiProperty({
    example: 'password',
  })
  @IsOptional()
  readonly password?: string;
}
