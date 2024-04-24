import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment-timezone';
import {
  Availability,
  AvailabilityDocument,
} from './schema/availability.schema';

@Injectable()
export class AvailabilityService {
  private readonly defaultInterval: number = 120;
  private readonly defaultStartHour: string = '08:00';
  private readonly defaultEndHour: string = '18:00';

  constructor(
    @InjectModel(Availability.name)
    private readonly availabilityModel: Model<AvailabilityDocument>,
  ) {}

  async generateAvailability(
    startDate: string,
    endDate: Date,
    startTime: string = this.defaultStartHour,
    endTime: string = this.defaultEndHour,
    interval: number = this.defaultInterval,
  ): Promise<void> {
    const availabeSlots: {
      date: string;
      startTime: string;
      endTime: string;
      available: boolean;
    }[] = [];

    let currentDate = moment(startDate).tz('America/Buenos_Aires');

    while (currentDate.isSameOrBefore(endDate, 'day')) {
      const dayOfWeek = currentDate.day();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const startDateTime = currentDate.clone().set({
          hour: parseInt(startTime.split(':')[0]),
          minute: parseInt(startTime.split(':')[1]),
          second: 0,
        });

        if (currentDate.isSameOrAfter(startDateTime, 'minute')) {
          const slots = this.generateSlotsForDate(
            currentDate.format('YYYY-MM-DD'),
            startTime,
            endTime,
            interval,
          );

          for (const slot of slots) {
            availabeSlots.push({ ...slot, available: true });
          }
        }
      }
      currentDate = currentDate.add(1, 'day');
    }

    await this.availabilityModel.create(availabeSlots);
  }

  private generateSlotsForDate(
    date: string,
    startTime: string,
    endTime: string,
    interval: number,
  ): { date: string; startTime: string; endTime: string }[] {
    const slots: {
      date: string;
      startTime: string;
      endTime: string;
      available: boolean;
    }[] = [];

    const currentTime = moment(date).tz('America/Buenos_Aires');

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    currentTime.set({ hour: startHour, minute: startMinute });

    while (
      currentTime.hour() < endHour ||
      (currentTime.hour() === endHour && currentTime.minute() < endMinute)
    ) {
      const slotStartTime = currentTime.format('HH:mm');

      currentTime.add(interval, 'minutes');

      const slotEndTime = currentTime.format('HH:mm');

      slots.push({
        date: currentTime.format('YYYY-MM-DD'),
        startTime: slotStartTime,
        endTime: slotEndTime,
        available: true,
      });
    }
    return slots;
  }

  async markSlotUnavailable(date: string, startTime: string): Promise<void> {
    await this.availabilityModel.findOneAndUpdate(
      {
        date,
        startTime,
      },
      {
        available: false,
      },
    );
  }

  async markSlotsUnavailableBeforeDate(date: string): Promise<void> {
    await this.availabilityModel.updateMany(
      {
        date: { $lt: date },
        available: true,
      },
      {
        $set: { available: false },
      },
    );
  }

  async markSlotAvailable(slotId: string): Promise<void> {
    await this.availabilityModel.findByIdAndUpdate(slotId, {
      available: true,
    });
  }

  async getAvailableSlots(date: string): Promise<Availability[]> {
    const currentDate = moment()
      .tz('America/Buenos_Aires')
      .format('YYYY-MM-DD');
    const selectedDate = moment(date)
      .tz('America/Buenos_Aires')
      .format('YYYY-MM-DD');

    if (currentDate === selectedDate) {
      const currentTime = moment().tz('America/Buenos_Aires');
      const currentHour = currentTime.format('HH');
      const currentMinute = currentTime.format('mm');

      await this.availabilityModel.updateMany(
        {
          date: currentDate,
          startTime: { $lt: currentHour + ':' + currentMinute },
          available: true,
        },
        { $set: { available: false } },
      );
    }
    return this.availabilityModel
      .find({ date: selectedDate, available: true })
      .exec();
  }

  async getAll(): Promise<Availability[]> {
    const currentTime = moment().tz('America/Buenos_Aires');
    const currentHour = currentTime.format('HH');
    const currentMinute = currentTime.format('mm');

    await this.availabilityModel.updateMany(
      {
        date: currentTime.format('YYYY-MM-DD'),
        startTime: { $lt: currentHour + ':' + currentMinute },
        available: true,
      },
      { $set: { available: false } },
    );

    return this.availabilityModel
      .find({
        available: true,
      })
      .exec();
  }

  public async getDisabledDates(): Promise<string[]> {
    const disabledDates = await this.availabilityModel
      .find({ available: false })
      .distinct('date')
      .exec();

    return disabledDates;
  }
}
