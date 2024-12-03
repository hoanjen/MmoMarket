import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetOrderDetalDto {
  @ApiProperty({
    example: 'abcdedf',
    required: true,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsUUID()
  readonly order_id: string;
}
