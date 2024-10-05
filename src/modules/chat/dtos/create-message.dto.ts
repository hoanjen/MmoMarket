import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'group_id',
  })
  @IsString()
  @IsNotEmpty()
  readonly group_id: string;

  @ApiProperty({
    example: 5,
  })
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @ApiProperty({
    example: 'file name',
  })
  @IsString()
  @IsNotEmpty()
  readonly file_name: string;

  @ApiProperty({
    example: 'URL file',
  })
  @IsString()
  @IsOptional()
  readonly file: string;
}

export class JoinSingleChatDto {
  @ApiProperty({
    example: 'receiver_id',
  })
  @IsString()
  @IsNotEmpty()
  readonly receiver_id: string;
}
