
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // importa o bcrypt para criptografar la contraseña

//schema del usuario
const UserSchema = new mongoose.Schema({ 
  usuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' } // Añadir campo de rol
});

// esta función se ejecuta antes de guardar un nuevo usuario
UserSchema.pre('save', async function(next) { // Usa el método pre para ejecutar una función antes de guardar el usuario y el async para esperar a que termine la función
  if (!this.isModified('password')) return next(); // Si la contraseña no ha sido modificada, no hace nada
  this.password = await bcrypt.hash(this.password, 10); // Cifra la contraseña con bcrypt
});

UserSchema.methods.comparePassword = async function(candidatePassword) { // Define un método para comparar la contraseña ingresada con la contraseña cifrada
  return bcrypt.compare(candidatePassword, this.password); // Compara la contraseña ingresada con la contraseña cifrada
};

// Exporta el modelo de usuario
export default mongoose.model('Usuarios', UserSchema);
