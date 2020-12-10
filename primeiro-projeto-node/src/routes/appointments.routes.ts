import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

// Rota listar todos Appointments
appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.all();

  return response.json(appointments);
});

// Rota create Appointment
appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    // Verificação date disponivel
    const parsedDate = parseISO(date);

    // new Appointment
    const creteAppointment = new CreateAppointmentService(
      appointmentsRepository,
    );

    const appointment = creteAppointment.execute({
      date: parsedDate,
      provider,
    });

    return response.json(appointment);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default appointmentsRouter;
