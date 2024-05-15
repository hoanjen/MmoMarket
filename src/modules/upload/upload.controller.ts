import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
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
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3000000 }),
          new FileTypeValidator({ fileType: 'image' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const path = 'image'
    return this.uploadService.uploadFile(req.user.sub, path,files);
  }
}
