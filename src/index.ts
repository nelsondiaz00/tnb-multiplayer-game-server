import { Worker } from "worker_threads";
import { Server } from "socket.io";
import http from "node:http";
import express from "express";
import logger from "./utils/logger.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const MAIN_SERVER_PORT: number = 3000;
let currentPort: number = 3001;
const activeMatches = new Set<any>();
const workers = new Map<number, Worker>;

io.on("connection", (socket) => {
    logger.info(`Cliente conectado: ${socket.id}`);
    socket.on("createMatch", (data) => {
        logger.info(`Solicitud de nueva partida recibida: ${data}`);

        const { amountRed, amountBlue } = data;
        const matchPort = currentPort++;

        const worker = new Worker("./dist/match.worker.js", {
            workerData: { port: matchPort, amountRed, amountBlue },
        });

        workers.set(currentPort, worker);

        activeMatches.add({
            port: matchPort,
            amountRed: amountRed,
            amountBlue: amountBlue,
        });

        socket.emit("activeMatches", Array.from(activeMatches));

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
                    socket.emit("amountPlayers", message.data);
                }
            });
        } else {
            socket.emit("error", `No worker found for port ${port}`);
        }
    });
});

server.listen(MAIN_SERVER_PORT, () => {
    logger.info(`Servidor principal corriendo en el puerto: ${MAIN_SERVER_PORT}`);
});
