import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  // Rota index Get
  async index(req, res) {
    // Check se o User é Provider
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Somente o provider tem acesso a notificationsProvider.' });
    }

    // Listar notifications do provider
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createAt: 'desc' })
      .limit(20);


    return res.json(notifications);
  }

  // Rota update Put
  async update(req, res) {
    // Marcar a notificação como lida
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
