import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum VerificationType {
  VPA = 'VPA',
  VMA = 'VMA',
  VDA = 'VDA',
}

export type PriceDataDocument = HydratedDocument<PriceData>;

@Schema({ timestamps: true })
export class PriceData {
  @Prop({ enum: VerificationType, unique: true })
  verificationType: VerificationType;

  @Prop()
  price: number;
}

export const PriceDataSchema = SchemaFactory.createForClass(PriceData);
