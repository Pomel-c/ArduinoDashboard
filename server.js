const express = require('express');
const socketIo = require('socket.io');
const SerialPort = require('serialport').SerialPort;

const ejs = require('ejs');
const app = express();
const server = require('http').Server(app);
const io = socketIo(server);
const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));

const port = new SerialPort({
  path: 'COM3',
  baudRate: 9600
});

io.on('connection', (socket) => {
  port.on('data', (data) => {
    const dataArray = data.toString().split(',');
    socket.emit('arduino:data', dataArray);
  });
});

app.use(express.static('public'));

app.get('/charts', (req, res) => {
  res.render('charts');
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/table', (req, res) => {
  res.render('table');
});

server.listen(3000, () => {
  console.log('Server started on http://localhost:3000/');
});