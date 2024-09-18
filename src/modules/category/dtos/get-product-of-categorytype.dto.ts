import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class GetProductOfCategoryTypeDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '99e538ec-ce07-4c08-b1d3-4ca521279b3a',
    required: true,
  })
  readonly category_type_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'ASC',
    required: false,
  })
  readonly sortType: string;
}
