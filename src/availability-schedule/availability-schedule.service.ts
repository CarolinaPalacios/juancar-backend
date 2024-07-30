import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment-timezone';
import { AvailabilityService } from '../availability/availability.service';

@Injectable()
export class AvailabilityScheduleService {
  private readonly logger = new Logger(AvailabilityScheduleService.name);

  constructor(private readonly availabilityService: AvailabilityService) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON, {
    name: 'availability',
    timeZone: 'America/Buenos_Aires',
  })
  async generateAvailabilityDaily(): Promise<void> {
    const currentDate = moment()
      .tz('America/Buenos_Aires')
      .format('YYYY-MM-DD');

    await this.availabilityService.markSlotsUnavailableBeforeDate(currentDate);

    const endDate = moment()
      .tz('America/Buenos_Aires')
      .add(2, 'months')
      .toDate();

    this.logger.debug(`Called at: - ${currentDate}`);
    const availability = await this.availabilityService.generateAvailability(
      currentDate,
      endDate,
    );

    console.log(availability);
  }
}
