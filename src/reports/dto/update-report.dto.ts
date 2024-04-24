import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ReportType } from '../schema/report.schema';

export class UpdateReportDto {
  @IsOptional()
  @IsEnum(ReportType)
  @IsNotEmpty()
  reportType: ReportType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  price: string;
}
