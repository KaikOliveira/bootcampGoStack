import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    // Check date
    const { date } = req.query;

    if (!date) {
      return res.status(400).json ({ error: 'Data invalida.' });
    }

    // Validar o date num var Number/Int
    const searchDate = Number(date);

    // Filtrar dates dos appointments
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    // Todos os horarios que o provider atende
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '22:00',
      '23:00',
    ];

    // Retornar as datas disponivel pro user
    const avaiable = schedule.map(time => {
      // Desestruturação do horarios separando horas e minutos do array
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        // Check se o horarios esta disponivel
        avaiable: isAfter(value, new Date()) &&
        !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(avaiable);
  }
}

export default new AvailableController();
