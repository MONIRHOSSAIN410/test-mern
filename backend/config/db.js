import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri || uri === "memory") {
      const memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.log("Using in-memory MongoDB (no MONGO_URI configured)");
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
