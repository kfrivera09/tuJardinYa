import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token recibido:', token);

  if (!token) {
    console.log('Acceso denegado: No se proporcionó token');
    return res.status(403).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token inválido o expirado:', error);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
