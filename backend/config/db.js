import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri || uri === "memory") {
      // Imported lazily: mongodb-memory-server is a devDependency, so a
      // production install (npm ci --omit=dev) must not crash on this import.
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.log("Using in-memory MongoDB (no MONGO_URI configured)");
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`DB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
