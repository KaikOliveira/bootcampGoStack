import { uuid } from 'uuidv4';

class Appointment {
  // Interfaces
  id: string;

  provider: string;

  date: Date;

  // Iniciar
  constructor(provider: string, date: Date) {
    this.id = uuid();
    this.provider = provider;
    this.date = date;
  }
}

export default Appointment;
