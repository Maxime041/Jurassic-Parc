require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const gardiensRoutes = require('./Routes/Gardiens');
const errorHandler = require('./middleware/errorHandler');
const DinosauresRoutes = require('./routes/Dinosaures');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDB();

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});


app.use('/api/gardiens', gardiensRoutes);
app.use('/api/dinosaures', DinosauresRoutes);


// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}/health`);
});

module.exports = app;