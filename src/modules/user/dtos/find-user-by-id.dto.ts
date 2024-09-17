import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class FindUserByIdDto {
  @ApiProperty({
    example: 'id of user',
  })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  readonly user_id: string;
}
