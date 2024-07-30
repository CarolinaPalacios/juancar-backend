import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PriceData,
  PriceDataDocument,
  VerificationType,
} from './schema/price-data.schema';
import { UpdatePriceDataDto, CreatePriceDataDto } from './dto/price-data.dto';

@Injectable()
export class PriceService {
  constructor(
    @InjectModel(PriceData.name)
    private priceDataModel: Model<PriceDataDocument>,
  ) {}

  async findAll(): Promise<PriceData[]> {
    return this.priceDataModel.find().exec();
  }

  async findByType(verificationType: VerificationType): Promise<PriceData> {
    return this.priceDataModel.findOne({ verificationType }).exec();
  }

  async update(
    id: string,
    updatePriceDataDto: UpdatePriceDataDto,
  ): Promise<PriceData> {
    return this.priceDataModel
      .findByIdAndUpdate(id, updatePriceDataDto, { returnDocument: 'after' })
      .exec();
  }

  async create(createPriceDataDto: CreatePriceDataDto): Promise<PriceData> {
    const newPriceData = new this.priceDataModel(createPriceDataDto);
    return newPriceData.save();
  }
}
