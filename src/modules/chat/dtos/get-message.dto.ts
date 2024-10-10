import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetSideBarChatQueryDto {
  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value) : value))
  readonly limit: number;

  @ApiProperty({
    example: 'first',
  })
  @IsNotEmpty()
  @IsString()
  readonly cursor: string;
}
