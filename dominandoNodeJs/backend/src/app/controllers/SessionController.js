import jwt from 'jsonwebtoken';

import User from '../models/User';

class SessionController {
    async store(req, res) {
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
        token: jwt.sign({ id }, '670f2831e1eb6291b2f96c7b3e1a791e', {
          expiresIn: '7d',
        }),
    });
  }
}


export default new SessionController();
