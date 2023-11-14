// Import required modules
const express = require('express');
const socketIo = require('socket.io');
const SerialPort = require('serialport').SerialPort;
const ejs = require('ejs');

// Create an instance of the Express application
const app = express();

// Create a new SerialPort instance for communicating with an Arduino
const port = new SerialPort({
  path: 'COM3',
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
  // Listen for data from the SerialPort
  port.on('data', (data) => {
    // Split the data into an array of values
    const dataArray = data.toString().split(',');
    // Emit the data to all connected Socket.IO clients
    socket.emit('arduino:data', dataArray);
  });
});

// Ruta para la pagina de los graficos
app.get('/charts', (req, res) => {
  res.render('charts');
});

// Ruta para la pagina del index
app.get('/', (req, res) => {
  const motors = [
    {'id': 1, 'name': 'Motor 1 - Cinta transportadora', 'power': 0.5},
    {'id': 2, 'name': 'Motor 2 - Compresor taller', 'power': 1.0},
    {'id': 3, 'name': 'Motor 3 - Tornillo sin fin', 'power': 1.5},
    {'id': 4, 'name': 'Motor 4', 'power': 2.5}
    // Agrega más motores según sea necesario
  ];
  res.render('index', { motors });
});

// Ruta para la pagina de la tabla
app.get('/table', (req, res) => {
  res.render('table');
});

// Start the server
server.listen(3000, () => {
  console.log('Server started on http://localhost:3000/');
});