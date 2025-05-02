import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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

export class DataProductParamDto {
  @ApiProperty({
    example: 'id',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
