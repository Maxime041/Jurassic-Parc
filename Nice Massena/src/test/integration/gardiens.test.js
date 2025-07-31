const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Gardiens = require('../../model/gardiens');

describe('Gardiens API', () => {
  describe('GET /api/gardiens', () => {
    test('should return empty array when no gardiens exist', async () => {
      const response = await request(app)
        .get('/api/gardiens')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });

    test('should return all gardiens', async () => {
      // Create test data
      const testGardiens = [
        {
          name: 'John Hammond',
          specialty: 'carnivores',
          sector: 'A1',
          available: true,
          experience: 8
        },
        {
          name: 'Sarah Connor',
          specialty: 'herbivores',
          sector: 'B2',
          available: false,
          experience: 6
        }
      ];

      await Gardiens.insertMany(testGardiens);

      const response = await request(app)
        .get('/api/gardiens')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('John Hammond');
      expect(response.body[1].name).toBe('Sarah Connor');
    });
  });

  describe('GET /api/gardiens/:id', () => {
    test('should return gardien by id', async () => {
      const gardien = new Gardiens({
        name: 'John Hammond',
        specialty: 'carnivores',
        sector: 'A1',
        available: true,
        experience: 8
      });
      await gardien.save();

      const response = await request(app)
        .get(`/api/gardiens/${gardien._id}`)
        .expect(200);

      expect(response.body.name).toBe('John Hammond');
      expect(response.body.specialty).toBe('carnivores');
    });

    test('should return 404 for non-existent gardien', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/gardiens/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe('Gardien not found');
    });

    test('should return 500 for invalid ObjectId', async () => {
      await request(app)
        .get('/api/gardiens/invalid-id')
        .expect(500);
    });
  });

  describe('POST /api/gardiens', () => {
    test('should create new gardien', async () => {
      const newGardien = {
        name: 'Alan Grant',
        specialty: 'security',
        sector: 'C3',
        available: true,
        experience: 9
      };

      const response = await request(app)
        .post('/api/gardiens')
        .send(newGardien)
        .expect(201);

      expect(response.body.name).toBe('Alan Grant');
      expect(response.body._id).toBeDefined();

      // Verify it's in database
      const savedGardien = await Gardiens.findById(response.body._id);
      expect(savedGardien.name).toBe('Alan Grant');
    });

    test('should return 400 for missing required fields', async () => {
      const invalidGardien = {
        name: 'Incomplete Gardien'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/gardiens')
        .send(invalidGardien)
        .expect(400);

      expect(response.body.error).toContain('validation failed');
    });

    test('should return 400 for invalid enum values', async () => {
      const invalidGardien = {
        name: 'Invalid Gardien',
        specialty: 'invalid-specialty',
        sector: 'A1',
        available: true,
        experience: 5
      };

      await request(app)
        .post('/api/gardiens')
        .send(invalidGardien)
        .expect(400);
    });
  });

  describe('PUT /api/gardiens/:id', () => {
    test('should update existing gardien', async () => {
      const gardien = new Gardiens({
        name: 'John Hammond',
        specialty: 'carnivores',
        sector: 'A1',
        available: true,
        experience: 8
      });
      await gardien.save();

      const updateData = {
        name: 'John Hammond Updated',
        specialty: 'medical',
        sector: 'B2',
        available: false,
        experience: 9
      };

      const response = await request(app)
        .put(`/api/gardiens/${gardien._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('John Hammond Updated');
      expect(response.body.specialty).toBe('medical');
      expect(response.body.available).toBe(false);
    });

    test('should return 404 for non-existent gardien', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .put(`/api/gardiens/${fakeId}`)
        .send({ name: 'Updated Name' })
        .expect(404);
    });
  });

  describe('DELETE /api/gardiens/:id', () => {
    test('should delete existing gardien', async () => {
      const gardien = new Gardiens({
        name: 'John Hammond',
        specialty: 'carnivores',
        sector: 'A1',
        available: true,
        experience: 8
      });
      await gardien.save();

      const response = await request(app)
        .delete(`/api/gardiens/${gardien._id}`)
        .expect(200);

      expect(response.body.message).toBe('Gardien deleted successfully');

      // Verify it's deleted
      const deletedGardien = await Gardiens.findById(gardien._id);
      expect(deletedGardien).toBeNull();
    });

    test('should return 404 for non-existent gardien', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .delete(`/api/gardiens/${fakeId}`)
        .expect(404);
    });
  });
});