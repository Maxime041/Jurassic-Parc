const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  try {
    // Fermer toute connexion existante
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Démarrer MongoDB en mémoire
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Se connecter à MongoDB en mémoire
    await mongoose.connect(mongoUri);
    console.log('Base de données de test connectée');
  } catch (error) {
    console.error('Échec de la configuration des tests:', error);
    throw error;
  }
}, 30000);

afterAll(async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Échec du nettoyage des tests:', error);
  }
}, 30000);

beforeEach(async () => {
  try {
    // Nettoyage plus agressif
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } catch (error) {
    // Les collections peuvent ne pas exister, c'est normal
    console.log('Erreur de nettoyage des collections (attendue):', error.message);
  }
});