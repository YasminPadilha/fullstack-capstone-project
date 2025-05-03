// giftlink-backend/models/db.js
const { MongoClient } = require("mongodb");
const pinoLogger = require("../logger"); // Assuming you have a logger setup

// Define MongoDB connection string
const url = process.env.MONGO_URL || "mongodb://localhost:27017"; // MongoDB connection string
const dbName = "giftDB"; // The database you want to connect to

// Task 1: Connect to MongoDB
async function connectToDatabase() {
  try {
    const client = new MongoClient(url); // No need for useNewUrlParser and useUnifiedTopology anymore

    // Task 1: Connect to MongoDB
    await client.connect(); // Connecting to MongoDB

    // Task 2: Assign dbInstance
    const dbInstance = client.db(dbName); // Assigning the database instance

    // Task 3: Return dbInstance
    pinoLogger.info(
      `Successfully connected to MongoDB, using database: ${dbName}`
    );
    return dbInstance; // Returning the database instance
  } catch (err) {
    pinoLogger.error(`Error connecting to MongoDB: ${err.message}`);
    throw new Error("MongoDB connection failed");
  }
}

module.exports = connectToDatabase;
