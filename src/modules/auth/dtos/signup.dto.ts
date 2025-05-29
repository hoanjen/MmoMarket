import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  isNotEmpty,
} from 'class-validator';
import { USER_GENDER } from 'src/modules/user/user.constant';

export class SignUpDto {
  @ApiProperty({
    example: 'lew2k3@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  readonly email: string;

  @ApiProperty({
    example: 123456,
  })
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value) : value))
  @IsNumber()
  @IsNotEmpty()
  readonly otp: number;

  @ApiProperty({
    example: 'password@123',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly password: string;

  @ApiProperty({
    example: 'first name',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly first_name: string;

  @ApiProperty({
    example: 'last name',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly last_name: string;

  @ApiProperty({
    example: 'middle name',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly middle_name?: string;

  @ApiProperty({
    example: 'username',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly username: string;

  @ApiProperty({
    example: '0929329992',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly phone_number?: string;

  @ApiProperty({
    example: '2001-02-03',
  })
  // @IsDob()
  readonly dob: string;

  @ApiProperty({
    example: USER_GENDER.MALE,
  })
  @IsOptional()
  @IsEnum(USER_GENDER)
  readonly gender: USER_GENDER;

  @ApiProperty({
    example: 'avatar',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly avatar?: string;

  @ApiProperty({
    example: 'avatar',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly cover_image?: string;
}
