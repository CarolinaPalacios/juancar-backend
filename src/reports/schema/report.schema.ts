import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum ReportType {
  INFRINGEMENT = 'Informe Infracciones',
  DOMAIN = 'Informe Dominio',
  HISTORICAL = 'Informe Histórico',
  DOMAIN_AND_INFRINGEMENT = 'Informe Dominio Histórico + Infracciones',
}

export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report {
  @Prop({ enum: ReportType, required: true })
  reportType: string;

  @Prop({ required: true })
  plate: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  name: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
