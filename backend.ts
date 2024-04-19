import { Socket } from "net";
import { storeData } from "./data";
import { Request } from "express";

const express = require('express');
const net = require('net');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let server_message = "";

let clientSocket: Socket | null = null;
let datastreamSocket: Socket | null = null;
let awaitingData: boolean = true;

const server = net.createServer((socket) => {
    let messageBuffer: string = "";

    clientSocket = socket;
    console.log("Client connected");

    socket.on('data', (data: Buffer) => {
        const parse = JSON.parse(data.toString());
        
        const message = {
            response: parse.response,
            information: parse.information
        };
        
        server_message = JSON.stringify(message);
        console.log(`[TCP SERVER] (${clientSocket.remoteAddress}) Got back ${server_message}`);
        
    });

    socket.on('end', () => {
        console.log("Client disconnected");
        clientSocket = null;
    });
});

const datastreamServer = net.createServer((socket) => {
    let messageBuffer: string = "";
    datastreamSocket = socket;
    console.log("Datastream connected");

    //socket.write("awaiting data");

    socket.on('data', (data: Buffer) => {
        const newData: string = data.toString();

        messageBuffer += newData;

        try {
            const parsedData: any = JSON.parse(messageBuffer);

            messageBuffer = "";
            console.log("[TCP DS] Data gotten :^)");
            storeData(parsedData.screenData);
            datastreamSocket.write(JSON.stringify({ response: "Data received" }));
        } catch (error) {
            console.log("[TCP DS] Data not gotten :^(");
        }
    });

    socket.on('end', () => {
        console.log("Datastream disconnected");
        datastreamSocket = null;
    });
});

app.get('/retrieve', (req: Request, res) => {
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
        console.log("[HTTP SERVER] called /send");

        new Promise<void>((resolve) => {
            const checkServerMessage = setInterval(() => {
                if(server_message !== "") {
                    clearInterval(checkServerMessage);
                    resolve();
                }
            }, 100);
        })
        .then(() => {
            res.status(200).send(server_message);
            console.log(`[TCP SERVER] Got back ${server_message}`);
        });
    } else {
        res.status(500).send('No TCP client connected');
    }
});

datastreamServer.listen(3003, () => {
    console.log('[TCP server] running on port 3003');
});

server.listen(3002, () => {
    console.log('[TCP server] running on port 3002');
});

app.listen(3001, () => {
    console.log('[HTTP server running on port 3001');
});