const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongoServer = new MongoMemoryServer();

const setupDatabase = async () => {
  await mongoServer.start();
  const mongoUri = await mongoServer.getUri();

  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongoUri);
};

const teardownDatabase = async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
};

module.exports = { setupDatabase, teardownDatabase };
