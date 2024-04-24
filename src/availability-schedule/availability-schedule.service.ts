import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment-timezone';
import { AvailabilityService } from '../availability/availability.service';

@Injectable()
export class AvailabilityScheduleService {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async generateAvailabilityDaily(): Promise<void> {
    const currentDate = moment()
      .tz('America/Buenos_Aires')
      .format('YYYY-MM-DD');

    await this.availabilityService.markSlotsUnavailableBeforeDate(currentDate);

    const endDate = moment()
      .tz('America/Buenos_Aires')
      .add(2, 'months')
      .toDate();

    await this.availabilityService.generateAvailability(currentDate, endDate);
  }
}
