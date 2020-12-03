import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail'
  }

  // Fila de jobs
  async handle({ data }){
    const { appointment } = data;

    // Enviar Email
    await Mail.sendMail({
      to: `${appointment.provider.name} < ${appointment.provider.email} >`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }

}

export default new CancellationMail();
