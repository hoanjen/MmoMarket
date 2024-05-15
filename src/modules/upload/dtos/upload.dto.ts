import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({ type: String, format: 'binary', required: false })
  @IsOptional()
  readonly file: Express.Multer.File;
}
