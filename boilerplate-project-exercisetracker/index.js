const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

let users = [];
let exercises = [];

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Create new user
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = { username, _id: generateId() };
  users.push(newUser);
  res.json(newUser);
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Add exercises
// Add exercises
app.post('/api/users/:_id/exercises', (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;
  const exerciseDate = date ? new Date(date) : new Date();
  const newExercise = {
    userId,
    description,
    duration: parseInt(duration),
    date: exerciseDate.toDateString()
  };
  exercises.push(newExercise);
  
  // Encontrar el usuario correspondiente
  const user = users.find(user => user._id === userId);
  
  // Si el usuario existe, agregar el ejercicio al array log y devolver una cadena representando el objeto de usuario
  if (user) {
    user.log = user.log || [];
    user.log.push(newExercise);
    res.send(JSON.stringify(user));
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});


// Get user's exercise log
app.get('/api/users/:_id/logs', (req, res) => {
  const userId = req.params._id;
  let userExercises = exercises.filter(exercise => exercise.userId === userId);
  
  // Filtrar por fechas si se proporcionan
  let { from, to, limit } = req.query;
  if (from) userExercises = userExercises.filter(exercise => new Date(exercise.date) >= new Date(from));
  if (to) userExercises = userExercises.filter(exercise => new Date(exercise.date) <= new Date(to));
  
  // Limitar el número de registros si se proporciona
  if (limit) userExercises = userExercises.slice(0, limit);
  
  // Encontrar el usuario correspondiente
  const user = users.find(user => user._id === userId);
  
  // Si el usuario existe, devolver el log de ejercicios
  if (user) {
    res.json({ _id: userId, count: userExercises.length, log: userExercises });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});


// Helper function to generate a random id
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
