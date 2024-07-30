import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceData, PriceDataSchema } from './schema/price-data.schema';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PriceData.name,
        schema: PriceDataSchema,
      },
    ]),
  ],
  providers: [PriceService],
  controllers: [PriceController],
})
export class PriceModule {}
