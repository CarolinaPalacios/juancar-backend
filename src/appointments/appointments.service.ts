import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schema/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AvailabilityService } from 'src/availability/availability.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    private readonly availabilityService: AvailabilityService,
  ) {}

  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel.find().exec();
  }

  async findOne(id: string): Promise<Appointment> {
    return this.appointmentModel.findById(id).exec();
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { date, time, year } = createAppointmentDto;

    const parsedYear = parseInt(year);

    if (!this.validateYear(parsedYear)) {
      throw new HttpException('Invalid year', HttpStatus.BAD_REQUEST);
    }

    const availableSlots =
      await this.availabilityService.getAvailableSlots(date);
    const isSlotAvailable = availableSlots.some(
      (slot) => slot.startTime === time,
    );

    if (!isSlotAvailable) {
      throw new HttpException(
        'The selected slot is not available',
        HttpStatus.BAD_REQUEST,
      );
    }

    const reservationNumber = await this.generateRandomReservationNumber();

    const createdAppointment = new this.appointmentModel({
      ...createAppointmentDto,
      reservationNumber,
      parsedYear,
    });

    const appointment = await createdAppointment.save();

    await this.availabilityService.markSlotUnavailable(date, time);

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto)
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.appointmentModel.findByIdAndDelete(id).exec();
  }

  private async generateRandomReservationNumber(): Promise<string> {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let result = '';

    for (let i = 0; i < 3; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    for (let i = 0; i < 3; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    const existingReservationNumber = await this.appointmentModel.findOne({
      reservationNumber: result,
    });

    if (existingReservationNumber) {
      return this.generateRandomReservationNumber();
    }

    return result;
  }

  private validateYear(year: number): boolean {
    const currentYear = new Date().getFullYear();

    if (year && year <= currentYear) {
      return true;
    }

    return false;
  }
}
