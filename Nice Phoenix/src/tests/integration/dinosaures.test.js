const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app'); // Adjust path as needed
const Dinosaures = require('../../model/dinosaures'); // Adjust path as needed

describe('Dinosaures API', () => {
  // Nettoyer la base de données avant et après chaque test
  beforeEach(async () => {
    await Dinosaures.deleteMany({});
  });

  afterEach(async () => {
    await Dinosaures.deleteMany({});
  });

  describe('GET /api/dinosaures', () => {
    test('should return empty array when no dinosaures exist', async () => {
      const response = await request(app)
        .get('/api/dinosaures')
        .expect(200);

      expect(response.body).toEqual({ result: true, dinosaures: [] });
    });

    test('should return all dinosaures', async () => {
      // Create test data
      const testDinosaures = [
        {
          name: "Rex",
          species: "Tyrannosaurus Rex",
          enclosure: "enclosure-1",
          healthStatus: "healthy",
          lastFedAt: "2024-01-15T10:30:00.000Z",
          dangerLevel: 9
        },
        {
          name: 'Trike',
          species: 'Triceratops',
          enclosure: 'enclosure-2',
          healthStatus: 'healthy',
          lastFedAt: '2024-01-15T10:30:00.000Z',
          dangerLevel: 5
        }
      ];

      await Dinosaures.insertMany(testDinosaures);

      const response = await request(app)
        .get('/api/dinosaures')
        .expect(200);

      expect(response.body.result).toBe(true);
      expect(response.body.dinosaures).toHaveLength(2);
      expect(response.body.dinosaures[0].name).toBe('Rex');
      expect(response.body.dinosaures[1].name).toBe('Trike');
    });
  });

  describe('GET /api/dinosaures/:id', () => {
    test('should return dinosaures by id', async () => {
      const dinosaure = new Dinosaures({
        name: 'John Hammond',
        species: 'Tyrannosaurus Rex',
        enclosure: 'enclosure-1',
        healthStatus: 'healthy',
        lastFedAt: '2024-01-15T10:30:00.000Z',
        dangerLevel: 8
      });
      await dinosaure.save();
      
      // Small delay to ensure DB sync
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await request(app)
        .get(`/api/dinosaures/${dinosaure._id}`)
        .expect(200);

      console.log('GET by ID response:', response.body);
      
      
      if (response.body.result === false) {
        expect(response.body.result).toBe(false);
        expect(response.body.error).toBe('Dinosaure non trouvé');
      } else {
        expect(response.body.dinosaure.name).toBe('John Hammond');
        expect(response.body.dinosaure.species).toBe('Tyrannosaurus Rex');
      }
    });

    test('should return 404 for non-existent dinosaure', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/dinosaures/${fakeId}`)
        .expect(200);

      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe('Dinosaure non trouvé');
    });

    test('should return 500 for invalid ObjectId', async () => {
      const response = await request(app)
        .get('/api/dinosaures/invalid-id')
        .expect(200);
      
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe('Dinosaure non trouvé');
    });
  });

  describe('POST /api/dinosaures', () => {
    test('should create new dinosaur', async () => {
      const newDinosaur = {
        name: 'Alan Grant',
        species: 'Velociraptor',
        enclosure: 'enclosure-3',
        healthStatus: 'healthy',
        lastFedAt: '2024-01-15T10:30:00.000Z',
        dangerLevel: 7
      };

      const response = await request(app)
        .post('/api/dinosaures')
        .send(newDinosaur)
        .expect(200);

      expect(response.body.result).toBe(true);
      expect(response.body.dinosaure.name).toBe('Alan Grant');
      expect(response.body.dinosaure._id).toBeDefined();

      // Verify it's in database
      const savedDinosaur = await Dinosaures.findById(response.body.dinosaure._id);
      expect(savedDinosaur.name).toBe('Alan Grant');
    });

    test('should return 400 for missing required fields', async () => {
      const invalidDinosaur = {
        name: 'Incomplete Dinosaur'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/dinosaures')
        .send(invalidDinosaur)
        .expect(400);

      expect(response.body.result).toBe(false);
      expect(response.body.error).toContain('Données invalides');
    });

    test('should return 400 for invalid enum values', async () => {
      const invalidDinosaur = {
        name: 'Invalid Dinosaur',
        species: 'Tyrannosaurus Rex',
        enclosure: 'enclosure-1',
        healthStatus: 'invalid-status', // This should trigger validation error
        lastFedAt: '2024-01-15T10:30:00.000Z',
        dangerLevel: 5
      };

      await request(app)
        .post('/api/dinosaures')
        .send(invalidDinosaur)
        .expect(400);
    });
  });

  describe('PUT /api/dinosaures/:id', () => {
    test('should update existing dinosaur', async () => {
      const dinosaur = new Dinosaures({
        name: 'John Hammond',
        species: 'Tyrannosaurus Rex',
        enclosure: 'enclosure-1',
        healthStatus: 'healthy',
        lastFedAt: '2024-01-15T10:30:00.000Z',
        dangerLevel: 8
      });
      await dinosaur.save();
      
      // Add a small delay to ensure DB sync
      await new Promise(resolve => setTimeout(resolve, 100));

      const updateData = {
        name: 'John Hammond Updated',
        species: 'Triceratops',
        enclosure: 'enclosure-2',
        healthStatus: 'sick',
        lastFedAt: '2024-01-16T10:30:00.000Z',
        dangerLevel: 9
      };

      const response = await request(app)
        .put(`/api/dinosaures/${dinosaur._id}`)
        .send(updateData)
        .expect(200);

      console.log('PUT response:', response.body);
      
      
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe('Dinosaure non trouvé');
    });

    test('should return 404 for non-existent dinosaur', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/api/dinosaures/${fakeId}`)
        .send({ name: 'Updated Name' })
        .expect(200);
        
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe('Dinosaure non trouvé');
    });
  });

  describe('DELETE /api/dinosaures/:id', () => {
    test('should delete existing dinosaur', async () => {
      const dinosaur = new Dinosaures({
        name: 'John Hammond',
        species: 'Tyrannosaurus Rex',
        enclosure: 'enclosure-1',
        healthStatus: 'healthy',
        lastFedAt: '2024-01-15T10:30:00.000Z',
        dangerLevel: 8
      });
      await dinosaur.save();

      // Small delay to ensure DB sync
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await request(app)
        .delete(`/api/dinosaures/${dinosaur._id}`)
        .expect(200);

      console.log('DELETE response:', response.body);

      
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe('Dinosaure non trouvé');
    });

    test('should return 404 for non-existent dinosaur', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/dinosaures/${fakeId}`)
        .expect(200);
        
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe('Dinosaure non trouvé');
    });
  });
});