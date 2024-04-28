const { MongoClient } = require('mongodb');
require('dotenv').config();


const uri = process.env.MONGODB_URI;
const dbname = process.env.DB_NAME;

const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    return client.db(dbname);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; 
  }
}

module.exports = { connectToMongoDB };
