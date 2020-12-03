import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
  // Rota index Get
  async index(req, res){
    const { page = 1 } = req.query;

    // Listar todos os agendamentos Ordem por data
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page -1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  // Rota store Post
  async store(req, res){
    // Vadalidação com Yup
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // Check se provider_id é a provider
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Nao pode criar appointments se nao é provider' });
    }

    // Vadalidaçoes de agendamento
    const hourStart = startOfHour(parseISO(date));

    // Verificar se hora ja passou
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Horario nao Permitido.' })
    }

    // Check se data esta disponivel
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Data nao Disponivel.' });
    }

    // Criar o agendamento
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    // Notificar o appointment Provider
    const user = await User.findByPk(req.userId);
    // Formatação da data e hora
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });


    return res.json(appointment);
  }

  // Rota delete Delete
  async delete(req, res) {
    // buscar dados do appointment
    const appointment = await Appointment.findByPk(req.params.id);

    // Verificar se o UserAppointment é o mesmo da Requisição
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "Voce não tem permissao para cancelar esse agendamento.",
      });
    }

    // Cancelar o appointment no max 2horas antes
    const dateWithSub = subHours(appointment.date, 2);

    // Verificar se ja passou do horario permitido
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'Voce so pode cancelar com 2horas de antecedencia',
      });
    }

    // Cancelar appointment com sucess
    appointment.canceled_at = new Date();
    await appointment.save();


    return res.json(appointment);
  }

}

export default new AppointmentController();
