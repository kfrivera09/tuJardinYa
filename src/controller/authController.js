import Usuarios from '../models/usuarios.js';
import jwt from 'jsonwebtoken'; // importa la libreria de token que permite generar tokens JWT
import dotenv from 'dotenv';

dotenv.config();

// Función para registrar un usuario y exportar 
export const registro = async (req, res) => {  
  try {
    const { usuario, email, password, role } = req.body; // Extrae los datos del cuerpo de la solicitud, incluyendo el rol
    const user = new Usuarios({ usuario, email, password, role }); // Crea un usuario con los datos, incluyendo el rol
    
    await user.save(); // Guarda el usuario en la base de datos
    
    const token = jwt.sign({ userId: user._id, role: user.role, usuario: user.usuario, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Genera un token JWT con los campos adicionales
    console.log('Usuario registrado exitosamente:', user);
    console.log('Token generado:', token);
    res.status(201).json({ message: 'Usuario registrado exitosamente', token }); // Devuelve un mensaje de éxito y el token
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// Función para iniciar sesión y se exporta
export const login = async (req, res) => { 
  try {
    const { email, password } = req.body; // Extrae los datos del cuerpo de la solicitud
    console.log('Intentando iniciar sesión con:', email);
    const user = await Usuarios.findOne({ email }); // Busca un usuario con el correo electrónico recibido
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' }); // Si no encuentra un usuario devuelve un mensaje de error

    console.log('Usuario encontrado:', user);
    const isMatch = await user.comparePassword(password); // Compara la contraseña recibida con la contraseña del usuario
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' }); // Si la contraseña no coincide devuelve un mensaje de error

    const token = jwt.sign({ userId: user._id, role: user.role, usuario: user.usuario, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Genera un token JWT con los campos adicionales
    console.log('Token generado:', token);
    res.json({ message: 'Inicio de sesión exitoso', token }); // Devuelve un mensaje de éxito y el token
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Función para eliminar un usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Intentando eliminar usuario con ID:', id);
    const user = await Usuarios.findByIdAndDelete(id);
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.log('Usuario eliminado exitosamente');
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};
