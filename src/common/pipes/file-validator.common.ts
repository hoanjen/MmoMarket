import { FileValidator, Injectable } from '@nestjs/common';

@Injectable()
export class CustomFileValidatorForFile extends FileValidator<{ allowedType: string }> {
  constructor(private readonly allowedType: string) {
    super({ allowedType });
  }

  isValid(file: Express.Multer.File): boolean {
    return this.allowedType.includes(file.mimetype);
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return `Only accept files with the format  ${this.allowedType}. Current format: : ${file.mimetype}`;
  }
}
