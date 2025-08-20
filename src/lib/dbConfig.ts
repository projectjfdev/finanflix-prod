import mongoose from 'mongoose';

/**
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
const mongoConnection = {
  isConnected: 0,
};

export const connectDB = async () => {
  if (mongoConnection.isConnected) {
    // console.log('⚡ Ya estamos conectados a MongoDB');
    return;
  }

  // Verifica si hay una conexión existente
  if (mongoose.connection.readyState === 1) {
    mongoConnection.isConnected = 1;
    // console.log('✅ Usando conexión previa a MongoDB');
    return;
  }

  try {
    // console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL || 'your-mongo-uri', {
      serverSelectionTimeoutMS: 5000, // Tiempo de espera para seleccionar un servidor
      socketTimeoutMS: 45000, // Tiempo de espera para operaciones
    });

    mongoConnection.isConnected = 1;
    // console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    mongoConnection.isConnected = 0; // Asegura que el estado no sea incorrecto
    throw new Error('Database connection failed');
  }
};

// 🔴 Desconectar solo si estamos en producción
export const disconnectDB = async () => {
  if (process.env.NODE_ENV === 'development') return;
  if (mongoConnection.isConnected === 0) return;

  try {
    // console.log('🔌 Desconectando de MongoDB...');
    await mongoose.disconnect();
    mongoConnection.isConnected = 0;
    // console.log('✅ Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error al desconectar la base de datos:', error);
  }
};
