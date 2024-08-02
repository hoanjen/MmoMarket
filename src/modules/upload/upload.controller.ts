import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ApiFiles, IsPublic } from 'src/common/decorators/decorator.common';
import { UploadService } from './upload.service';
import { UploadFileDto } from './dtos/upload.dto';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { CustomFileValidatorForFile } from 'src/common/pipes/file-validator.common';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiBearerAuth()
  @ApiProperty({
    name: 'Upload files',
  })
  @Post()
  @ApiFiles('files')
  async uploadFile(
    @Request() req:any,
    @UploadedFiles(
      new ParseFilePipeBuilder()
      .addValidator(new CustomFileValidatorForFile('image/png,image/jpg,image/jpeg'))
      .addMaxSizeValidator({
        maxSize: 300000,
        message: 'File is too large'
      })
      .build()
    )
    files: Array<Express.Multer.File>,
  ) {
    const path = 'image'
    return this.uploadService.uploadFile(req.user.sub, path,files);
  }
}
