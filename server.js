const express = require('express');
const socketIo = require('socket.io');
const SerialPort = require('serialport').SerialPort;


const app = express();
const server = require('http').Server(app);
const io = socketIo(server);

app.set('view engine', 'ejs');

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
  res.sendFile(__dirname + '/views/charts.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.ejs');
});


app.get('/table', (req, res) => {
  res.sendFile(__dirname + '/views/table.html');
});



server.listen(3000, () => {
  console.log('Server started on http://localhost:3000/');
});