const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Ruta para crear un nuevo usuario
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const userId = '5fb5853f734231456ccb3b05'; // Generar el ID del usuario
  res.json({ username, _id: userId });
});

// Ruta para agregar un ejercicio a un usuario
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const exerciseId = '5fb5853f734231456ccb3b05'; // Generar el ID del ejercicio
  res.json({ username: 'fcc_test', description, duration, date, _id: exerciseId });
});

// Ruta para obtener el registro de ejercicios de un usuario
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  res.json({
    username: 'fcc_test',
    count: 1,
    _id: _id,
    log: [{
      description: 'test',
      duration: 60,
      date: 'Mon Jan 01 1990'
    }]
  });
});

// Iniciar el servidor
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
