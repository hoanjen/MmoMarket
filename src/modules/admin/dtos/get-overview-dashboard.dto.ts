import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GetOverviewDashboardDto {
  @ApiProperty({
    example: '2024-12-19T15:33:12.416Z',
    default: new Date().toISOString(),
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    example: '2024-12-26T15:33:12.416Z',
    default: new Date(new Date().getTime() + 7 * 1000 * 3600 * 24).toISOString(),
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
