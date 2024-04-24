import {
  IsDate,
  IsEmail,
  IsEnum,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { FuelType, SellerType } from '../schema/appointment.schema';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  time: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  @IsEnum([SellerType.AGENCY, SellerType.PARTICULAR])
  sellerType: string;

  @IsOptional()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  year: string;

  @IsOptional()
  @IsString()
  @IsEnum([FuelType.GASOLINE, FuelType.DIESEL, FuelType.GNC])
  fuelType: string;

  @IsOptional()
  @IsBoolean()
  willAttend: boolean;
}
