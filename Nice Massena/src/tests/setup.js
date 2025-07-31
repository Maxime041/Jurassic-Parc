const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  try {
    // Disconnect from any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('Test database connected');
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error;
  }
}, 60000);

afterAll(async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Test teardown failed:', error);
  }
}, 60000);

beforeEach(async () => {
  try {
    // More aggressive cleanup
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
  } catch (error) {
    // Collections might not exist, that's ok
    console.log('Collection cleanup error (expected):', error.message);
  }
});