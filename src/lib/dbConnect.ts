
import mongoose from "mongoose";

interface Connection {
    isConnected?: number;
  }

const connection: Connection = {}; 
async function dbConnect() {
    if (connection.isConnected) {
        // console.log('Database connection already established.');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

        connection.isConnected = db.connections[0].readyState;
        console.log('DB connected successfully');
    } catch (error) {
        console.error('Error connecting to DB:', error);
        process.exit(1);
    }
}

export default dbConnect;
