const express = require('express');
const net = require('net');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/send', (req, res) => {
    res.send('command received');
    res.status(200);
    console.log("FUCK");
});

app.listen(3001, () => {
    console.log('Server running on port 3000');
});