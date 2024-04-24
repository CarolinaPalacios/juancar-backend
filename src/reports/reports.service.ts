import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './schema/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
// import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<ReportDocument>,
  ) {}

  async findAll(): Promise<Report[]> {
    return this.reportModel.find().exec();
  }

  async findOne(id: string): Promise<Report> {
    return this.reportModel.findById(id).exec();
  }

  async sendReport(createReportDto: CreateReportDto): Promise<Report> {
    const { price } = createReportDto;

    const parsedPrice = parseFloat(price);
    const createdReport = new this.reportModel({
      ...createReportDto,
      price: parsedPrice,
    });

    if (!createdReport) {
      throw new HttpException('Report not created', HttpStatus.BAD_REQUEST);
    }

    return createdReport.save();
  }

  async findTypes(): Promise<string[]> {
    const reportTypes = await this.reportModel.distinct('reportType').exec();
    return reportTypes;
  }
}
