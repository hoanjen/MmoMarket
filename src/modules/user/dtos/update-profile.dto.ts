import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { USER_GENDER } from '../user.constant';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'full name',
  })
  @IsString()
  @IsOptional()
  readonly full_name: string;

  @ApiProperty({
    example: 'first name',
  })
  @IsString()
  @IsOptional()
  readonly first_name: string;

  @ApiProperty({
    example: 'last name',
  })
  @IsString()
  @IsOptional()
  readonly last_name: string;

  @ApiProperty({
    example: 'middle name',
  })
  @IsString()
  @IsOptional()
  readonly middle_name: string;

  @ApiProperty({
    example: '2001-02-03',
  })
  @IsString()
  @IsOptional()
  readonly dob: string;

  @ApiProperty({
    example: 'MALE',
  })
  @IsEnum(USER_GENDER)
  @IsOptional()
  readonly gender: USER_GENDER;

  @ApiProperty({
    example: 'url',
  })
  @IsString()
  @IsOptional()
  readonly avatar: string;

  @ApiProperty({
    example: 'url',
  })
  @IsString()
  @IsOptional()
  readonly cover_image: string;

  @ApiProperty({
    example: 'url',
  })
  @IsString()
  @IsOptional()
  readonly google_id: string;

  @ApiProperty({
    example: '09',
  })
  @IsString()
  @IsOptional()
  readonly phone_number: string;
}

export class ForgotPassword {
  @ApiProperty({
    example: 'email',
    required: true,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'new password',
    required: true,
  })
  @IsString()
  readonly new_password: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  readonly otp: string;
}
