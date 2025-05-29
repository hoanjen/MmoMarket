import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ReportOrderDTO {
  @ApiProperty({
    example: 'id order',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly order_id: string;

  @ApiProperty({
    example: 'id merchant',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly merchant_id: string;

  @ApiProperty({
    example: 'quantity',
  })
  @IsString()
  @IsOptional()
  readonly reason: string;
}

export class CancelReportOrderDTO {
  @ApiProperty({
    example: 'id order',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly order_id: string;
}

export class ReturnMoneyForReportOrderDTO {
  @ApiProperty({
    example: 'id order',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly order_id: string;
}
