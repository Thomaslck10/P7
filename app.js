// Serveur

const express = require('express');
const app = express();


// Sanitize

const mongoSanitize = require('express-mongo-sanitize');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// rate-limiter

const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 50,
});

// Base de données

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://thomasluck10:totodu10@cluster0.mbtqffb.mongodb.net/',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Headers

const helmet = require('helmet')

app.use(helmet({crossOriginResourcePolicy: false,}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Images

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

app.use('/api/books', bookRoutes);
app.use('/api/auth', authLimiter, userRoutes);



module.exports = app;
