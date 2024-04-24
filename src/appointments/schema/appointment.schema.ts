import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum SellerType {
  AGENCY = 'AGENCY',
  PARTICULAR = 'PARTICULAR',
}

export enum FuelType {
  GASOLINE = 'GASOLINE',
  DIESEL = 'DIESEL',
  GNC = 'GNC',
}

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({ timestamps: true })
export class Appointment {
  @Prop()
  date: Date;

  @Prop()
  time: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  location: string;

  @Prop({ enum: SellerType, default: SellerType.PARTICULAR })
  sellerType: string;

  @Prop()
  brand: string;

  @Prop()
  model: string;

  @Prop()
  year: number;

  @Prop({ enum: FuelType, default: FuelType.GASOLINE })
  fuelType: string;

  @Prop()
  reservationNumber: string;

  @Prop({ default: true })
  willAttend: boolean;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
