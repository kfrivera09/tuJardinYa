import mongoose from 'mongoose'; // Para importar mongoose

//esquema de agenda

const agendaSchema = new mongoose.Schema({
    titulo: { type: String, required: true }, // Nombre del trabajo
    descripcion: { type: String, required: true }, // Descripción de la cita
    direccion: { type: String, required: true },
    fecha: { type: Date, required: true }, // Fecha 
    hora: { type: String, required: true }, // Hora 
    estado: { type: String, enum: ['pendiente', 'realizada'], default: 'pendiente' }, // Estado de la cita
  });
  
// Creamos el modelo basado en el esquema
const Agen = mongoose.model('agenda', agendaSchema);

export default Agen; // Exportamos el modelo para usarlo en las rutas