function errorHandler(err, req, res, next) {
    console.error(err.stack);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        result: false,
        error: 'Données invalides',
        details: errors
      });
    }
    
    if (err.code === 11000) {
      return res.status(409).json({
        result: false,
        error: 'Conflit de données - Cette ressource existe déjà'
      });
    }
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        result: false,
        error: 'ID invalide'
      });
    }
    
    res.status(500).json({
      result: false,
      error: 'Erreur Serveur'
    });
  }
  
  module.exports = errorHandler;