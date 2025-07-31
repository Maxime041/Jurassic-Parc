const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Incidents = require('../../model/incidents');

describe('Incidents API', () => {
  // Nettoyer la base de données avant et après chaque test
  beforeEach(async () => {
    await Incidents.deleteMany({});
  });

  afterEach(async () => {
    await Incidents.deleteMany({});
  });

  describe('GET /api/incidents', () => {
    test('should return empty array when no incidents exist', async () => {
      const response = await request(app)
        .get('/api/incidents')
        .expect(200);

      expect(response.body).toEqual({ result: true, incidents: [] });
    });

    test('should return all incidents', async () => {
      // Create test data
      const testIncidents = [
        {
          type: 'malfunction',
          severity: 'high',
          location: 'A1',
          assignedKeeper: 'John Hammond',
          status: 'open',
          createdAt: new Date()
        },
        {
          type: 'escape',
          severity: 'medium',
          location: 'B2',
          assignedKeeper: 'Sarah Connor',
          status: 'in-progress',
          createdAt: new Date()
        }
      ];
      await Incidents.insertMany(testIncidents);

      const response = await request(app)
        .get('/api/incidents')
        .expect(200);

      expect(response.body.result).toBe(true);
      expect(response.body.incidents).toHaveLength(2);
      expect(response.body.incidents[0].assignedKeeper).toBe('John Hammond');
      expect(response.body.incidents[1].assignedKeeper).toBe('Sarah Connor');
    });
  });

  describe('GET /api/incidents/:id', () => {
    test('should return incidents by id', async () => {
      const incident = new Incidents({
        type: 'malfunction',
        severity: 'high',
        location: 'A1',
        assignedKeeper: 'John Hammond',
        status: 'open',
        createdAt: new Date()
      });
      await incident.save();

      const response = await request(app)
        .get(`/api/incidents/${incident._id}`)
        .expect(200);

      expect(response.body.result).toBe(true);
      expect(response.body.incident.assignedKeeper).toBe('John Hammond');
      expect(response.body.incident.status).toBe('open');
    });

    test('should return 404 for non-existent incident', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/incidents/${fakeId}`)
        .expect(404);

      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe('Incident non trouvé');
    });

       test('should return 400 for invalid ObjectId', async () => {
      await request(app)
        .get('/api/incidents/invalid-id')
        .expect(400);
    });
  });

describe('POST /api/incidents', () => {
  test('should create a new incident', async () => {
    const newIncident = {
      type: 'malfunction',
      severity: 'high',
      location: 'A1',
      assignedKeeper: 'John Hammond',
      status: 'open',
      createdAt: new Date()
    };

    const response = await request(app)
      .post('/api/incidents')
      .send(newIncident)
      .expect(200);

    expect(response.body.result).toBe(true);
    expect(response.body.incident.type).toBe('malfunction');
    expect(response.body.incident._id).toBeDefined();
  });

  test('should return 400 for missing required fields', async () => {
    const invalidIncident = {
      type: 'malfunction'
      // missing severity, etc.
    };

    const response = await request(app)
      .post('/api/incidents')
      .send(invalidIncident)
      .expect(400);

    expect(response.body.result).toBe(false);
    expect(response.body.error).toBe('Données invalides');
  });

  test('should return 400 for invalid enum values', async () => {
    const invalidIncident = {
      type: 'alien-attack', // invalid enum
      severity: 'extreme', // invalid enum
      location: 'Z9',
      assignedKeeper: 'Rick Sanchez',
      status: 'panic', // invalid enum
      createdAt: new Date()
    };

    const response = await request(app)
      .post('/api/incidents')
      .send(invalidIncident)
      .expect(400);

    expect(response.body.result).toBe(false);
    expect(response.body.error).toBe('Données invalides');
  });
});

  describe('PUT /api/incidents/:id', () => {
    test('should update existing incident', async () => {
      const incident = new Incidents({
        type: 'malfunction',
        severity: 'high',
        location: 'A1',
        assignedKeeper: 'John Hammond',
        status: 'open',
        createdAt: new Date()
      });
      await incident.save();

      const updateData = {
        type: 'malfunction',
        severity: 'medium',
        location: 'A1',
        assignedKeeper: 'John Hammond',
        status: 'in-progress',
        createdAt: new Date()
      };

      const response = await request(app)
        .put(`/api/incidents/${incident._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.result).toBe(true);
      expect(response.body.incident.severity).toBe('medium');
      expect(response.body.incident.status).toBe('in-progress');
    });

    test('should return 404 for non-existent incident', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .put(`/api/incidents/${fakeId}`)
        .send({ type: 'malfunction' })
        .expect(404);
    });
  });

  describe('DELETE /api/incidents/:id', () => {
    test('should delete existing incident', async () => {
      const incident = new Incidents({
        type: 'malfunction',
        severity: 'high',
        location: 'A1',
        assignedKeeper: 'John Hammond',
        status: 'open',
        createdAt: new Date()
      });
      await incident.save();

      const response = await request(app)
        .delete(`/api/incidents/${incident._id}`)
        .expect(200);

      expect(response.body.result).toBe(true);
      expect(response.body.message).toBe('Incident supprimé !');
    });

    test('should return 404 for non-existent incident', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .delete(`/api/incidents/${fakeId}`)
        .expect(404);
    });
  });
  });