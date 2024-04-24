import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AvailabilityDocument = HydratedDocument<Availability>;

@Schema()
export class Availability {
  @Prop()
  date: string;

  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  available: boolean;
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);
