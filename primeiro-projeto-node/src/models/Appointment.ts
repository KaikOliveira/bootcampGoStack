import { uuid } from 'uuidv4';

class Appointment {
  // Interfaces
  id: string;

  provider: string;

  date: Date;

  // Iniciar
  constructor({ provider, date }: Omit<Appointment, 'id'>) {
    this.id = uuid();
    this.provider = provider;
    this.date = date;
  }
}

export default Appointment;
