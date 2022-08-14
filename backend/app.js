const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoose = require('mongoose');
const path= require('path');
require('dotenv').config();


const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

app.use(helmet({crossOriginResourcePolicy : false}));


//connexion BDD
mongoose.connect(`mongodb+srv://${process.env.BDD_username}:${process.env.BDD_password}@${process.env.BDD_cluster}/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  //outrepasser CORS securitée
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  //anciennement bodyParser
app.use(express.json());



  app.use('/api/sauces',saucesRoutes);
  app.use('/api/auth',userRoutes);
  app.use('/images',express.static(path.join(__dirname,'images')));

module.exports = app;