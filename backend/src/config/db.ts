import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined in .env");

    await mongoose.connect(uri, {
      dbName: 'mcgi_kiosk'
    });
    console.log('📦 MongoDB Atlas Connected Successfully (Mongoose Native)');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};
