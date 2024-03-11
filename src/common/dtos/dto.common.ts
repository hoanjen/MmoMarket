import { IsArray, IsNumber, Min } from 'class-validator';

export class CommonDto {
  // @IsNumber()
  // @IsArray()
  // @Min(1)
  test: number;
}
