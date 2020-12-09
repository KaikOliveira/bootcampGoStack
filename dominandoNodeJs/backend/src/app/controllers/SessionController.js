import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {

    // Function CREATE Session
    async store(req, res) {

      // Vadalidaçoes do Yup
      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails' });
      }

      // Buscando email e password do Body
      const { email, password } = req.body;

      // Verificação se existe usuario com o email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Usuario nao Existe.' });
      }

      // Verificacção se a senha esta correta
      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password esta incorreto.'})
      }

      // Se esta tudo correto
      const { id, name } = user;

      return res.json({
        user: {
          id,
          name,
          email,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
    });
  }
}


export default new SessionController();
