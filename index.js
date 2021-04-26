const express = require('express');
const socket = require('socket.io');
const app = express();
const port = 3000;

const server = app.listen(port, () => {
    console.log('Listening at http://localhost: ' + port);
});

app.use(express.static("public"));
const io = socket(server, {
    cors: {
        origin: 'http://localhost:5500',
        methods: ["GET", "POST"]
    }
  });

io.on('connection', (socket) => {
	console.log('New user connected')

    socket.on('chat', (data) => {
        io.sockets.emit('chat',data);
    })

    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {userName : data})
    })
})

app.get('/', (req, res) => {
	res.render('index')
})