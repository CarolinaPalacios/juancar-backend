import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { AvailabilityService } from './availability.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async generateAvailability() {
    const startDate = moment().tz('America/Argentina/Buenos_Aires').format();

    const endDate = moment().tz('America/Buenos_Aires').toDate();
    endDate.setDate(endDate.getDate() + 60);

    await this.availabilityService.generateAvailability(startDate, endDate);

    return { message: 'Availability generated successfully' };
  }

  @Get()
  async getAvailability() {
    return this.availabilityService.getAll();
  }

  @Get('disabled-dates')
  async getDisabledDates() {
    try {
      const disabledDates = await this.availabilityService.getDisabledDates();
      return disabledDates;
    } catch (error) {
      console.error(`Error getting disabled dates: ${error}`);
      throw error;
    }
  }

  @Get(':date')
  async getAvailableSlots(@Param('date') date: string) {
    const slots = await this.availabilityService.getAvailableSlots(date);
    return slots;
  }
}
