import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import '../../config/config.env';

@ApiBearerAuth()
@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReportDto: CreateReportDto) {
    try {
      const { email, name, plate, price, reportType } = createReportDto;

      const message = `Hola JuanCar, mi nombre es ${name} y estoy solicitando un informe de tipo ${reportType} para el vehículo con patente ${plate} por el precio publicado desde $${price}. Mi correo electrónico es ${email}. Te pido cotización, muchas gracias.`;

      const createdReport =
        await this.reportsService.sendReport(createReportDto);

      return {
        report: createdReport,
        url: `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      };
    } catch (error) {
      console.error(`Error creating report: ${error}`);
      throw new HttpException(
        `An error occurred while creating the report, ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Get('types')
  findTypes() {
    return this.reportsService.findTypes();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: CreateReportDto) {
    return this.reportsService.update(id, updateReportDto);
  }
}
