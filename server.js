// Import required modules
const express = require('express');
const socketIo = require('socket.io');
const SerialPort = require('serialport').SerialPort;
const ejs = require('ejs');

//  ssh -R 80:localhost:5000 localhost.run
//  btunnel http --key JDJhJDEyJEZ3L3dvWGtkWVQ3ZVhsYkVJbFREUE9DYkwwTVJoanhFRlhGRXV2UmE4RDVvVGJvdWtkWE1L --port 5000


// Create an instance of the Express application
const app = express();

// Create a new SerialPort instance for communicating with an Arduino
const port = new SerialPort({
  path: '/dev/cu.usbserial-1410',
  baudRate: 9600
});

// Create an HTTP server using the Express app
const server = require('http').Server(app);

// Create a Socket.IO instance using the HTTP server
const io = socketIo(server);

// Import Express middleware for rendering views with EJS
const expressLayouts = require('express-ejs-layouts');

// Use the Express middleware for rendering views with EJS
app.use(expressLayouts);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Listen for new Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected');
  // Listen for data from the SerialPort
  port.on('data', (data) => {
    // Split the data into an array of values
    const dataArray = data.toString().split(',');
    console.log(dataArray);
    // [voltaje, corriente, temperatura, rpm]
    // Emit the data to all connected Socket.IO clients
    socket.emit('arduino:data', dataArray);
  });
});


const motors = [
  {
    'id': 1,
    'name': 'Motor 1 - Cinta transportadora',
    'voltage': '220-240 V',
    'rpm': 1850,
    'current': '2.5 A',
    'frequency': '50 Hz',
    'max_temp': 80,
    'rated_power': 0.5
  },
  {
    'id': 2,
    'name': 'Motor 2 - Compresor taller',
    'voltage': '220-240 V',
    'rpm': 2000,
    'current': '3.0 A',
    'frequency': '60 Hz',
    'max_temp': 90,
    'rated_power': 1.0
  },
  {
    'id': 3,
    'name': 'Motor 3 - Tornillo sin fin',
    'voltage': '220-240 V',
    'rpm': 2600,
    'current': '3.0 A',
    'frequency': '50 Hz',
    'max_temp': 75,
    'rated_power': 1.5
  },
  {
    'id': 4,
    'name': 'Motor 4',
    'voltage': '220-240 V',
    'rpm': 1600,
    'current': '2.5 A',
    'frequency': '50 Hz',
    'max_temp': 90,
    'rated_power': 2.5
  }
  // Agrega más motores según sea necesario
];

// Ruta para la pagina del index
app.get('/', (req, res) => {
  res.render('index', { motors });
});

// Ruta para detalles del motor
app.get('/motor_details/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const motor = motors.find(m => m.id === id);
  if (motor) {
    res.render('detail', { motor });
  } else {
    res.status(404).send('Motor not found');
  }
});

// Ruta para la pagina de los graficos
app.get('/charts', (req, res) => {
  res.render('charts');
});


// Ruta para la pagina de la tabla
app.get('/table', (req, res) => {
  res.render('table');
});


app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/chart', (req, res) => {
  res.render('temperaturachart');
});

// Start the server
server.listen(3000, () => {
  console.log('Server started on http://localhost:3000/');
});