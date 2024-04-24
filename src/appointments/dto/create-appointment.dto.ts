import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { FuelType, SellerType } from '../schema/appointment.schema';

export class CreateAppointmentDto {
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum([SellerType.AGENCY, SellerType.PARTICULAR])
  sellerType: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  year: string;

  @IsString()
  @IsEnum([FuelType.GASOLINE, FuelType.DIESEL, FuelType.GNC])
  fuelType: string;

  @IsBoolean()
  willAttend: boolean;
}
