import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // Salvar o up no \temp do app
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        // Exemplo u234asf342.png
        return cb(null, res.toString('hex') + extname(file.originalname));
      })
    }
  }),
}
