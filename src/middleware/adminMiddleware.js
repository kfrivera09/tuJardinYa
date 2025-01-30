import Usuarios from '../models/usuarios.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const checkAdminRole = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Token recibido para verificar rol:', token);

  if (!token) {
    console.log('No autorizado: No se proporcionó token');
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usuarios.findById(decoded.userId);
    console.log('Usuario autenticado:', user);

    if (user.role !== 'admin') {
      console.log('Acceso denegado: Usuario no es admin');
      return res.status(403).json({ message: 'No tiene permisos para acceder a esta sección' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Token inválido o expirado:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export { checkAdminRole };
