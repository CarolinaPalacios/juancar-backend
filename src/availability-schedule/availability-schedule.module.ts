import { Module } from '@nestjs/common';
import { AvailabilityScheduleService } from './availability-schedule.service';
import { AvailabilityModule } from 'src/availability/availability.module';

@Module({
  imports: [AvailabilityModule],
  providers: [AvailabilityScheduleService],
})
export class AvailabilityScheduleModule {}
