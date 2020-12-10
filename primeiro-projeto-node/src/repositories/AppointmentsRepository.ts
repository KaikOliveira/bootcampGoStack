import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

class AppointmentsRository {
  private appointments: Appointment[];

  // Inicio
  constructor() {
    this.appointments = [];
  }

  // Metodo Listar todos Appointments
  public all(): Appointment[] {
    return this.appointments;
  }

  // Metodo de Vadalidação Date
  public findByDate(date: Date): Appointment | null {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(date, appointment.date),
    );

    return findAppointment || null;
  }

  // Metodo New Appoinment
  public create(provider: string, date: Date): Appointment {
    const appointment = new Appointment(provider, date);

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRository;
