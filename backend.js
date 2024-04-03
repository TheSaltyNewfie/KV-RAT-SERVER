var express = require('express');
var net = require('net');
var cors = require('cors');
var app = express();
app.use(cors());
app.use(express.json());
var server_message = "";
var clientSocket = null;
var server = net.createServer(function (socket) {
    clientSocket = socket;
    socket.on('data', function (data) {
        console.log("Received: " + data.toString());
        server_message = data;
        console.log("[TCP SERVER] Got back ".concat(server_message));
    });
    socket.on('end', function () {
        console.log("Client disconnected");
        clientSocket = null;
    });
});
app.get('/retrieve', function (req, res) {
    res.send(server_message);
    res.status(200);
    console.log("[HTTP SERVER] called /retrieve");
});
app.post('/send', function (req, res) {
    var message = {
        command: req.body.command,
        information: "None",
        mouseData: {
            x: 102,
            y: 1313
        }
    };
    if (clientSocket) {
        clientSocket.write(JSON.stringify(message));
        res.status(200).send(server_message);
        console.log("[TCP SERVER] Got back ".concat(server_message));
        console.log("[HTTP SERVER] called /send");
    }
    else {
        res.status(500).send('No TCP client connected');
    }
});
server.listen(3002, function () {
    console.log('TCP server running on port 3002');
});
app.listen(3001, function () {
    console.log('HTTP server running on port 3001');
});
