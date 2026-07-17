// src/app.js

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const ocorrenciasRoutes = require('./routes/ocorrencias');
const OcorrenciaQueries = require('./models/OcorrenciaQueries');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
    },
  })
);

app.use('/', ocorrenciasRoutes);

const port = Number(process.env.PORT) || 3000;

(async () => {
  try {
    // await OcorrenciaQueries.ensureSeedData();
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar o banco:', error);
    process.exit(1);
  }
})();
