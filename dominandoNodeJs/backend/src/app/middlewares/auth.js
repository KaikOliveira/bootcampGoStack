import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Buscar o Token no Header
  const authHeader = req.headers.authorization;

  // Se existe um Token no Header ! err Token nao enviado
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided '});
  }

  // Desestruturar o Array para pegar so o token
  const [, token] = authHeader.split(' ');

  try {
    // Verificação do Token e buscando o ID do User da Session/Token
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    console.log(decoded);

    return next();

  } catch (err) {
    return res.status(401).json({ error: 'Token invalid '});
  }

};
