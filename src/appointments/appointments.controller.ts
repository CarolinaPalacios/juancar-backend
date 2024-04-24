import {
  Body,
  Controller,
  Delete,
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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { SellerType } from './schema/appointment.schema';
import '../../config/config.env';

@ApiBearerAuth()
@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    try {
      const { name, address, email, phone, location, date, sellerType, time } =
        createAppointmentDto;

      const message = `Hola JuanCar, mi nombre es ${name} y estoy solicitando una reserva para el día ${date} a las ${time}hs. Mi correo electrónico es ${email} y mi teléfono de contacto es ${phone}. Reservé en la dirección ${address}, ubicada en ${location}. Además, quisiera informarte que el vendedor es de tipo ${sellerType === SellerType.AGENCY ? 'Agencia' : 'Particular'}.`;

      const createdAppointment =
        await this.appointmentsService.create(createAppointmentDto);

      return {
        appointment: createdAppointment,
        url: `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      };
    } catch (error) {
      console.error(`Error creating appointment: ${error}`);
      throw new HttpException(
        `An error occurred while creating the appointment, ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
