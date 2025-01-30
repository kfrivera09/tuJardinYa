// backend/src/routes/adminRoutes.js
import express from 'express';
import { obtenerUsuarios } from '../controller/adminController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { checkAdminRole } from '../middleware/adminMiddleware.js';
import { eliminarUsuario } from '../controller/authController.js';

const router = express.Router();

// Ruta para obtener todos los usuarios (solo accesible para admin) y Protege la ruta con el middleware checkAdminRole
router.get('/usuarios', authenticateJWT, checkAdminRole, obtenerUsuarios, eliminarUsuario);

export default router;