const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();




const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const eventRoute = require('./routes/eventRoute');
const userRoute = require('./routes/userRoute');


// Set view engine to ejs
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/eventHub')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(
    methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

app.get('/', (req, res) => {
  res.send('Welcome to EventHub API!');
});

app.use('/events', eventRoute);
app.use('/user', userRoute);


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinEvent', (eventId) => {
    socket.join(eventId);
    console.log(`User joined event: ${eventId}`);
  });

  socket.on('leaveEvent', (eventId) => {
    socket.leave(eventId);
    console.log(`User left event: ${eventId}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
