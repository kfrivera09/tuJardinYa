import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const ConectarDB = async () => { // funcion para conectar a la base de datos
  try {
    await mongoose.connect(process.env.DB_URI, { // se utiliza el proceso de ambiente para obtener la url de la base de datos
      useNewUrlParser: true, // se utiliza el nuevo formato de url
      useUnifiedTopology: true, // se utiliza la nueva forma de conectar a la base de datos
    });
    console.log('Base de datos conectada "MongoDB"'); 
  } catch (error) {
    console.error('Error al conectar a la base de datos. "MongoDB":', error.message);
    process.exit(1);
  }
};