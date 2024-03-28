var express = require('express');
var net = require('net');
var cors = require('cors');
var app = express();
app.use(cors());
app.use(express.json());
app.post('/send', function (req, res) {
    res.send('command received');
    res.status(200);
    console.log("FUCK");
});
app.listen(3001, function () {
    console.log('Server running on port 3000');
});
