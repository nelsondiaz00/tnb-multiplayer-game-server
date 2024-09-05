import { Worker } from 'worker_threads';
import { Server } from "socket.io";
import http from "node:http";
import express from "express";
import logger from './utils/logger';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const MAIN_SERVER_PORT = 3000;
let currentPort = 3001;

io.on("connection", (socket) => {
    logger.info("Cliente conectado:", socket.id);

    socket.on("createMatch", (data) => {
        logger.info("Solicitud de nueva partida recibida:", data);

        const { amountRed, amountBlue } = data;
        const matchPort = currentPort++;

        const worker = new Worker('./dist/match.worker.js', {
            workerData: { port: matchPort, amountRed, amountBlue },
        });

        socket.emit("matchDetails", { port: matchPort });

        worker.on('message', (msg) => {
            logger.info(`Match on port ${matchPort} says:`, msg);
            socket.emit("matchWinner", msg);
        });

        worker.on('error', (err) => {
            logger.error(`Match on port ${matchPort} encountered an error:`, err);
        });

        worker.on('exit', (code) => {
            logger.info(`Match on port ${matchPort} exited with code ${code}`);
        });
    });
});

server.listen(MAIN_SERVER_PORT, () => {
    logger.info(`Servidor principal corriendo en el puerto: ${MAIN_SERVER_PORT}`);
});
