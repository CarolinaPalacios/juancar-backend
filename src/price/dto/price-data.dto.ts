import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { VerificationType } from '../schema/price-data.schema';

export class CreatePriceDataDto {
  @IsEnum(VerificationType)
  verificationType: VerificationType;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdatePriceDataDto {
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
