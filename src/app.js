import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import agendaRoutes from './routes/agendaRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { ConectarDB } from './config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateJWT } from './middleware/authMiddleware.js'; // Importa el middleware de autenticación
import { checkAdminRole } from './middleware/adminMiddleware.js'; // Importa el middleware de rol de administrador

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname + '../public/index.html');
  res.sendFile(indexPath);
});

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
ConectarDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/admin', adminRoutes);

// Protege las rutas que requieren autenticación y verificación de rol
app.get('/html/dashboard.html', authenticateJWT, checkAdminRole, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/dashboard.html'));
});

app.get('/html/agenda.html', authenticateJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/agenda.html'));
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});
