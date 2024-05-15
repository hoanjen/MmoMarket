import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadFileDto } from './dtos/upload.dto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('BUCKET_REGION'),
    credentials: {
      accessKeyId: this.configService.get('ACCESS_KEY_S3'),
      secretAccessKey: this.configService.get('SECRET_ACCESS_KEY_S3'),
    },
  });
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(user_id: string, path: string, files: Array<any>) {
    if (files.length == 0) {
      throw new BadRequestException('Files not empty');
    }
    const ListPromise = [];
    const links = [];
    const bucketName = this.configService.get('BUCKET_NAME');
    files.forEach((file) => {
      const key = `${path}/${Date.now().toString()}-${user_id}-${
        file.originalname
      }`;
      const promise = this.uploadFormat(key, file);
      ListPromise.push(promise);
      links.push({
        url: `https://${bucketName}.s3.amazonaws.com/${key}`,
        name: file.originalname,
        size: file.size,
      });
    });

    await Promise.all(ListPromise);
    
    return links;
  }

  async uploadFormat(key: string, file: Express.Multer.File) {
    const uploadFile = this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );
    return uploadFile;
  }
}
