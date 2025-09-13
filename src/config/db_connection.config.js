import mongoose from "mongoose";

// Enacpsulated connection with error handlig and graceful shutdown
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    
    const DATABASE_URI = process.env.DATABASE_URI;

    if (!DATABASE_URI) {
      throw new Error("DATABASE_URI is missing in .env file");
    }

    await mongoose.connect(DATABASE_URI, {});

    console.log(`[DB] Database Connected- ${DATABASE_URI}`);

    mongoose.connection.on("error", (err) => {
      console.log(`[DB] Database connection error- ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn(`[DB] Database disconnected`);
    });
  } catch (error) {
    console.error(`[DB] Failed to connect with Database: ${error}`);
    process.exit(1);
  }
};

// Graceful shoutdown for DB
const closeDB = async () => {
  try {
    await mongoose.connection.close(false);
    console.log(`[DB] Database connection closed`);
  } catch (error) {
    console.error(`[DB] Error while closing Database connection: `, error);
  }
};

// close connection on app termination signals
process.on('SIGINT', async () => {
  console.log(`[DB] SIGINT recieved - closing DB connection`);
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
console.log('[DB] SIGTERM received — closing DB connection');
await closeDB();
process.exit(0);
});


export { connectDB, closeDB };