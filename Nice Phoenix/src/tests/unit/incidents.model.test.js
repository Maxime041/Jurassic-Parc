const Incidents = require('../../Model/incidents');

describe('Incidents Model - Unitaire', () => {
  it('devrait valider un incident correct', () => {
    const incident = new Incidents({
      type: 'escape',
      severity: 'high',
      location: 'Zone C',
      assignedKeeper: 'Jean',
      status: 'open',
      createdAt: new Date()
    });

    const error = incident.validateSync();
    expect(error).toBeUndefined();
  });

  it('devrait échouer si type est invalide', () => {
    const incident = new Incidents({
      type: 'party',
      severity: 'high',
      location: 'Zone C',
      assignedKeeper: 'Jean',
      status: 'open',
      createdAt: new Date()
    });

    const error = incident.validateSync();
    expect(error.errors['type']).toBeDefined();
  });

  it('devrait échouer si status est invalide', () => {
    const incident = new Incidents({
      type: 'escape',
      severity: 'high',
      location: 'Zone C',
      assignedKeeper: 'Jean',
      status: 'delayed',
      createdAt: new Date()
    });

    const error = incident.validateSync();
    expect(error.errors['status']).toBeDefined();
  });
});