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
    // Buscando email e Password atual/antiga
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // Alteração no email
    if (email !== user.email){
        // Tratamento de erro = EMAIL ja existente
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User ja Existe.' });
      }
    }

    // Verificação se a senha antiga/atual é a mesma
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password err.'});
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
