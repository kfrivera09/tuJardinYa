import Usuarios from '../models/usuarios.js';

// Obtener la lista de usuarios (solo para admin)
export const obtenerUsuarios = async (req, res) => {
  try {
    const user = req.user; // 'req.user' es el usuario autenticado, proviene del middleware de autenticación
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado, solo administradores pueden ver los usuarios.' });
    }

    const users = await Usuarios.find();
    res.status(200).json(users); // Respondemos con la lista de usuarios
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};
