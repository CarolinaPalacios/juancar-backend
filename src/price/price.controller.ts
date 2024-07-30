import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PriceService } from './price.service';
import { UpdatePriceDataDto, CreatePriceDataDto } from './dto/price-data.dto';
import { VerificationType } from './schema/price-data.schema';

@ApiTags('price')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  findAll() {
    return this.priceService.findAll();
  }

  @Get(':verificationType')
  findByType(@Param('verificationType') verificationType: VerificationType) {
    return this.priceService.findByType(verificationType);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  create(@Body() createPriceDataDto: CreatePriceDataDto) {
    return this.priceService.create(createPriceDataDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePriceDataDto: UpdatePriceDataDto,
  ) {
    return this.priceService.update(id, updatePriceDataDto);
  }
}
