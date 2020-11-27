import User from '../models/User';

class UserController {
  async store(req, res) {
    // Tratamento de erro = EMAIL ja existente
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User ja Existe.' });
    }

    // Create user
    const { id, name, email, provider } = await User.create(req.body);

    // Retorno pro front
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    return res.json({ ok: true })
  }
}

export default new UserController();
