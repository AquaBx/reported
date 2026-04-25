import mongoose from 'mongoose';
import { env } from '$env/dynamic/private';

const MONGODB_URI = env.MONGODB_URI || 'mongodb://localhost:27017/reported';

export async function connectDB() {
    if (mongoose.connection.readyState === 1) return;
    
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB',MONGODB_URI);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
    }
}
