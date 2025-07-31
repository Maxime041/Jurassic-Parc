const Gardiens = require('../../model/Gardiens');

describe('Gardiens Model - Unitaire', () => {
  it('devrait valider un gardien valide', () => {
    const gardien = new Gardiens({
      name: 'Jean',
      specialty: 'security',
      sector: 'A1',
      available: true,
      experience: 5
    });

    const error = gardien.validateSync();
    expect(error).toBeUndefined();
  });

  it('devrait échouer si la spécialité est invalide', () => {
    const gardien = new Gardiens({
      name: 'Jean',
      specialty: 'plombier',
      sector: 'A1',
      available: true,
      experience: 5
    });

    const error = gardien.validateSync();
    expect(error.errors['specialty']).toBeDefined();
  });

  it('devrait échouer si l’expérience est hors limites', () => {
    const gardien = new Gardiens({
      name: 'Jean',
      specialty: 'security',
      sector: 'A1',
      available: true,
      experience: 15
    });

    const error = gardien.validateSync();
    expect(error.errors['experience']).toBeDefined();
  });
});