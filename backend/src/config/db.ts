import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not set. Check your environment variables.');
    process.exit(1); // Can't run without a DB URI - this is a config error
  }

  try {
    await mongoose.connect(uri, {
      dbName: 'mcgi_kiosk',
      serverSelectionTimeoutMS: 12_000,
      connectTimeoutMS: 12_000,
    });
    console.log('📦 MongoDB Atlas Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    // Don't exit — let Render/nodemon handle restarts gracefully
    // The server will still start, and the next request will retry
  }
};
