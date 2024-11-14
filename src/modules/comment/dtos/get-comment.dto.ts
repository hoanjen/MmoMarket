import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetCommentDto {
  @ApiProperty({
    example: 'product_id',
  })
  @IsString()
  @IsNotEmpty()
  readonly product_id: string;
}
