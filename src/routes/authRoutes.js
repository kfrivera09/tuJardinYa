import express from 'express';
import { registro, login, eliminarUsuario } from '../controller/authController.js';

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/registro', registro);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para eliminar un usuario
router.delete('/usuarios/:id', eliminarUsuario);

export default router;