import * as Yup from 'yup';

import User from '../models/User';

class UserController {

  // Function CREATE USER
  async store(req, res) {

    // Vadalidaçoes do Yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }


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

  // Function UPDATE USER
  async update(req, res) {

    // Vadalidaçoes do Yup
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

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
