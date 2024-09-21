import { Worker } from "worker_threads";
import { Server } from "socket.io";
import http from "node:http";
import express from "express";
import logger from "./utils/logger.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const MAIN_SERVER_PORT: number = parseInt(process.env['SERVER_MAIN_PORT'] || '3000');
const HOST: string = process.env['SERVER_HOST'] || 'localhost';

let currentPort: number = 3001;
const activeMatches = new Set<any>();
const workers = new Map<number, Worker> ();

io.on("connection", (socket) => {
    logger.info(`Cliente conectado: ${socket.id}`);
    socket.on("createMatch", (data) => {
        logger.info(`Solicitud de nueva partida recibida: ${data}`);

        const { amountRed, amountBlue } = data;
        const matchPort = currentPort++;

        const worker = new Worker("./dist/match.worker.js", {
            workerData: { port: matchPort, amountRed, amountBlue },
        });

        workers.set(matchPort, worker);

        activeMatches.add({
            port: matchPort,
            amountRed: amountRed,
            amountBlue: amountBlue,
        });

        io.emit("activeMatches", Array.from(activeMatches));
        logger.info("hasta acá debería llegar, no?");
        socket.emit("matchDetails", { port: matchPort });

        worker.on("message", (msg) => {
            logger.info(`Match on port ${matchPort} says: ${msg}`);
            socket.emit("matchWinner", msg);
        });

        worker.on("error", (err) => {
            logger.error(
                `Match on port ${matchPort} encountered an error: ${err}`
            );
        });

        worker.on("exit", (code) => {
            logger.info(`Match on port ${matchPort} exited with code ${code}`);
        });
    });

    socket.on("getActiveMatches", () => {
        logger.info("Solicitud para obtener partidas activas recibida.");
        socket.emit("activeMatches", Array.from(activeMatches));
    });

    socket.on("getPlayersAmount", (port: number) => {
        const worker = workers.get(port);
        if (worker) {
            worker.postMessage("getPlayersAmount");
            worker.once("message", (message) => {
                if (message.type === "playersAmount") {
                    socket.emit("playersAmount", message.data);
                    logger.info(`${message.data}  sí entró`)
                }
            });
        } else {
            socket.emit("error", `No worker found for port ${port}`);
        }
    });
});

server.listen(3000, 'localhost', () => {
    console.log(`Server is running on http://${HOST}:${MAIN_SERVER_PORT}`);
});
