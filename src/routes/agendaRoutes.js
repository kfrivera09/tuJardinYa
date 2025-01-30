import express from 'express';
import { getAgenda, crearAgen, actualizarAgen, eliminarAgen, actualizarEstadoAgen } from '../controller/agendaController.js';

const router = express.Router();// importa el registro y login de authController


router.get('/', getAgenda); // esto crea una ruta para el método GET
router.post('/', crearAgen) // esto crea una ruta para el método POST
router.put('/:id', actualizarAgen) // esto crea una ruta para el método POST
router.put('/:id/estado', actualizarEstadoAgen);
router.delete('/:id', eliminarAgen) // esto crea una ruta para el método DELETE


export default router;