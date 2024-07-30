import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import '../config/config.env';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvailabilityModule } from './availability/availability.module';
import { ReportsModule } from './reports/reports.module';
import { AvailabilityScheduleModule } from './availability-schedule/availability-schedule.module';
import { PriceModule } from './price/price.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB_URI),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    AppointmentsModule,
    AvailabilityModule,
    ReportsModule,
    AvailabilityScheduleModule,
    PriceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
