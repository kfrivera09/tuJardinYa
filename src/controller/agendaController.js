import moment from 'moment';
import express from 'express';
import Agen from '../models/agenda.js';

const router = express.Router();

export const getAgenda = async (req, res) => {
  try {
    const agenda = await Agen.find();
    res.status(200).json(agenda);
  } catch (error) {
    console.error('Error al obtener la agenda:', error);
    res.status(500).json({ message: error.message });
  }
};

export const crearAgen = async (req, res) => {
  try {
    const { titulo, descripcion, direccion, fecha, hora, estado } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!titulo || !descripcion || !direccion || !fecha || !hora) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    console.log('Fecha recibida:', fecha);

    // Convertir la fecha al formato ISO 8601 si no está en el formato adecuado
    const fechaConvertida = moment(fecha, moment.ISO_8601, true).isValid() ? new Date(fecha) : moment(fecha, 'YYYY-MM-DD').toDate();
    console.log('Fecha convertida:', fechaConvertida);

    if (isNaN(fechaConvertida.getTime())) {
      return res.status(400).json({ message: 'Fecha inválida' });
    }

    const newAgen = new Agen({
      titulo,
      descripcion,
      direccion,
      fecha: fechaConvertida,
      hora,
      estado: estado || 'pendiente' // Valor predeterminado para estado
    });

    await newAgen.save();
    res.status(201).json(newAgen);
  } catch (error) {
    console.error('Error al crear la agenda:', error);
    res.status(500).json({ message: error.message });
  }
};

//metodo para actualizar el estado de la agenda
export const actualizarEstadoAgen = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar que el campo 'estado' esté presente
    if (!estado) {
      return res.status(400).json({ message: 'El estado es requerido' });
    }

    const updatedAgen = await Agen.findByIdAndUpdate(id, { estado }, { new: true });

    if (!updatedAgen) {
      return res.status(404).json({ message: 'Agenda no encontrada' });
    }

    res.status(200).json(updatedAgen);
  } catch (error) {
    console.error('Error al actualizar el estado de la agenda:', error);
    res.status(500).json({ message: error.message });
  }
};

export const actualizarAgen = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, direccion, fecha, hora, estado } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!titulo || !descripcion || !direccion || !fecha || !hora) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    console.log('Fecha recibida:', fecha);

    // Convertir la fecha al formato ISO 8601 si no está en el formato adecuado
    const fechaConvertida = moment(fecha, moment.ISO_8601, true).isValid() ? new Date(fecha) : moment(fecha, 'YYYY-MM-DD').toDate();
    console.log('Fecha convertida:', fechaConvertida);

    if (isNaN(fechaConvertida.getTime())) {
      return res.status(400).json({ message: 'Fecha inválida' });
    }

    const updatedAgen = await Agen.findByIdAndUpdate(id, {
      titulo,
      descripcion,
      direccion,
      fecha: fechaConvertida,
      hora,
      estado
    }, { new: true });

    res.status(200).json(updatedAgen);
  } catch (error) {
    console.error('Error al actualizar la agenda:', error);
    res.status(500).json({ message: error.message });
  }
};

export const eliminarAgen = async (req, res) => {
  try {
    const { id } = req.params;
    const agendaEliminada = await Agen.findByIdAndDelete(id);
    if (!agendaEliminada) {
      return res.status(404).json({ message: 'Agenda no encontrada' });
    }
    res.status(200).json({ message: 'Agenda eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la agenda:', error);
    res.status(500).json({ message: error.message });
  }
};

export default router;
