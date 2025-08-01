const Dinosaures = require('../../Model/dinosaures');

describe('Dinosaures Model - Unitaire', () => {
  it('devrait valider un dinosaure valide', () => {
    const dino = new Dinosaures({
      name: 'Rex',
      species: 'Tyrannosaurus',
      enclosure: 'E1',
      healthStatus: 'healthy',
      lastFedAt: new Date(),
      dangerLevel: 7
    });

    const error = dino.validateSync();
    expect(error).toBeUndefined();
  });

  it('devrait échouer si dangerLevel est hors limites', () => {
    const dino = new Dinosaures({
      name: 'Rex',
      species: 'Tyrannosaurus',
      enclosure: 'E1',
      healthStatus: 'healthy',
      lastFedAt: new Date(),
      dangerLevel: 15
    });

    const error = dino.validateSync();
    expect(error.errors['dangerLevel']).toBeDefined();
  });

  it('devrait échouer si healthStatus est invalide', () => {
    const dino = new Dinosaures({
      name: 'Rex',
      species: 'Tyrannosaurus',
      enclosure: 'E1',
      healthStatus: 'zombie',
      lastFedAt: new Date(),
      dangerLevel: 5
    });

    const error = dino.validateSync();
    expect(error.errors['healthStatus']).toBeDefined();
  });
});
