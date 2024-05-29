import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class GetProductWithCategoryTypeIdDto {
  @ApiProperty({
    example: 'id of categorytype',
    required: true,
  })
  @IsUUID()
  @IsOptional()
  readonly categorytype_id: string;

  @Transform(({ value }) =>
    typeof value === 'number' ? value : parseInt(value),
  )
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: '10',
    required: false,
  })
  readonly limit: number;

  @Transform(({ value }) =>
    typeof value === 'number' ? value : parseInt(value),
  )
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: '1',
    required: false,
  })
  readonly page: number;
}
