import { Router } from 'express';
import { uuid } from 'uuidv4';

const appointmentsRouter = Router();

// Array de memoria
const appointments = [];

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const appointment = {
    id: uuid(),
    provider: String,
    date: String,
  };

  appointments.push(appointment);

  return response.json(appointment);
});

export default appointmentsRouter;
