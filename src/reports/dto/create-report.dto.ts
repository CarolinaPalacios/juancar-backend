import { IsEnum, IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ReportType } from '../schema/report.schema';

export class CreateReportDto {
  @IsEnum(ReportType)
  @IsNotEmpty()
  reportType: ReportType;

  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
