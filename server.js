//  ssh -R 80:localhost:3000 nokey@localhost.run
//  btunnel http --key JDJhJDEyJEZ3L3dvWGtkWVQ3ZVhsYkVJbFREUE9DYkwwTVJoanhFRlhGRXV2UmE4RDVvVGJvdWtkWE1L --port 3000
//  ngrok http 3000

// Import required modules
const express = require('express');
const socketIo = require('socket.io');
const SerialPort = require('serialport').SerialPort;
const ejs = require('ejs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const bodyParser = require('body-parser');
const app = express();
const port = new SerialPort({
  path: '/dev/cu.usbserial-110',
  // path: 'COM3',
  baudRate: 9600
});
const server = require('http').Server(app);
const io = socketIo(server);
const expressLayouts = require('express-ejs-layouts');

db.serialize(() => {
  db.run("CREATE TABLE motors (id INTEGER PRIMARY KEY, name TEXT, voltage TEXT, rpm INTEGER, current TEXT, frequency TEXT, max_temp INTEGER, rated_power REAL)");

  const motors = [
    {
      'id': 1,
      'name': 'Cinta transportadora',
      'voltage': '220-240 V',
      'rpm': '3000 rpm',
      'current': '2.0  A',
      'frequency': '50 Hz',
      'max_temp': '80 ºC',
      'rated_power': 0.5
    },
    {
      'id': 2,
      'name': 'Compresor taller',
      'voltage': '220-240 V',
      'rpm': '2000 rpm',
      'current': '3.0 A',
      'frequency': '60 Hz',
      'max_temp': '90 ºC',
      'rated_power': 1.0
    }
  ];

  const stmt = db.prepare("INSERT INTO motors VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  for (let i = 0; i < motors.length; i++) {
    stmt.run(motors[i].id, motors[i].name, motors[i].voltage, motors[i].rpm, motors[i].current, motors[i].frequency, motors[i].max_temp, motors[i].rated_power);
  }
  stmt.finalize();
});


app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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



// Ruta para la pagina del index
app.get('/', (req, res) => {
  db.all("SELECT * FROM motors", [], (err, motors) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('index', { motors });
  });
});

// Ruta para detalles del motor
app.get('/motor_details/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get("SELECT * FROM motors WHERE id = ?", [id], (err, motor) => {
    if (err) {
      return console.error(err.message);
    }
    if (motor) {
      res.render('detail', { motor });
    } else {
      res.status(404).send('Motor not found');
    }
  });
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


app.get('/newCard', (req, res) => {
  res.render('newCard');
});


app.post('/newCard', (req, res) => {
  const { name, voltage, rpm, current, frequency, max_temp, rated_power } = req.body;
  const voltageWithUnit = voltage + ' V';
  const rpmWithUnit = rpm + ' rpm';
  const currentWithUnit = current + ' A';
  const frequencyWithUnit = frequency + ' Hz';
  const max_tempWithUnit = max_temp + ' ºC';
  const rated_powerWithUnit = rated_power;
  db.run(`INSERT INTO motors (name, voltage, rpm, current, frequency, max_temp, rated_power) VALUES (?, ?, ?, ?, ?, ?, ?)`, [name, voltageWithUnit, rpmWithUnit, currentWithUnit, frequencyWithUnit, max_tempWithUnit, rated_powerWithUnit], function(err) {
      if (err) {
          return console.log(err.message);
      }
      res.redirect('/');
  });
});
app.get('/deleteMotor/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM motors WHERE id = ?`, id, (err) => {
      if (err) {
          return console.error(err.message);
      }
      res.redirect('/');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server started on http://localhost:3000/');
});