require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const gardiensRoutes = require('./Routes/gardiens');
const errorHandler = require('./middleware/errorHandler');
const DinosauresRoutes = require('./Routes/dinosaures');
const IncidentsRoutes = require('./Routes/incidents');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connexion à la base de données seulement si ce n'est pas un test
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/gardiens', gardiensRoutes);
app.use('/api/dinosaures', DinosauresRoutes);
app.use('/api/incidents', IncidentsRoutes);

// Error handling
app.use(errorHandler);

// Ne démarrer le serveur que si ce n'est pas un test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Access at: http://localhost:${PORT}/health`);
  });
}

module.exports = app;