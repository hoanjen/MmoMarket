import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'product_id',
  })
  @IsString()
  @IsNotEmpty()
  readonly product_id: string;

  @ApiProperty({
    example: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  readonly star: number;

  @ApiProperty({
    example: 'good',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty({
    example: 'URL image',
  })
  @IsString()
  @IsOptional()
  readonly image: string;
}
