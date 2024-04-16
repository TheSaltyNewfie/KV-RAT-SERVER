import { Socket } from "net";
import { storeData } from "./data";

const express = require('express');
const net = require('net');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let server_message = "";

let clientSocket: Socket | null = null;

const server = net.createServer((socket) => {
    let messageBuffer: string = "";

    clientSocket = socket;
    console.log("Client connected");

    socket.on('data', (data: Buffer) => {
        const newData: string = data.toString();

        messageBuffer += newData;

        try {
            const parsedData: any = JSON.parse(messageBuffer);

            console.log("Received: ", parsedData);

            storeData(parsedData.screenData.binaryData);

            const message = {
                response: parsedData.response.toString(),
                information: parsedData.information.toString()
            };

            server_message = JSON.stringify(message);

            messageBuffer = "";
        } catch (error) {
            console.log("Waiting for complete message...");
        }
    });

    socket.on('end', () => {
        console.log("Client disconnected");
        clientSocket = null;
    });
});
app.get('/retrieve', (req, res) => {
    res.send(server_message);
    res.status(200);
    console.log("[HTTP SERVER] called /retrieve");
});

app.post('/send', (req, res) => {
    const message = {
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
        console.log(`[TCP SERVER] Got back ${server_message}`);
        console.log("[HTTP SERVER] called /send");
    } else {
        res.status(500).send('No TCP client connected');
    }
});

server.listen(3002, () => {
    console.log('TCP server running on port 3002')
});

app.listen(3001, () => {
    console.log('HTTP server running on port 3001');
});