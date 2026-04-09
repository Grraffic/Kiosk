import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    console.log("---- RENDER DEBUG INFO ----");
    console.log("DID RENDER PASS MONGODB_URI?:", uri ? "YES" : "NO");
    if (uri) {
        console.log("FIRST 15 CHARACTERS:", uri.substring(0, 15));
    }
    console.log("---------------------------");

    if (!uri) throw new Error("MONGODB_URI is extremely missing! Render dashboard didn't pass it!");

    await mongoose.connect(uri, {
      dbName: 'mcgi_kiosk'
    });
    console.log('📦 MongoDB Atlas Connected Successfully (Mongoose Native)');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};
