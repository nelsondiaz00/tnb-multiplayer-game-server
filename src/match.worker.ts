import { parentPort, workerData } from "worker_threads";
import express from "express";
import morgan from "morgan";
import http from "node:http";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger.js";
import { SocketHandler } from "./helper/socket.handler.js";
import { MatchLoader } from "./helper/match.loader.js";
import { Turns } from "./helper/turns.js";
import { GameSettings } from "./utils/game.settings.js";
import { IWorker } from "./interfaces/IWorker.interface.js";

const morganStream = {
    write: (message: string) => logger.info(message.trim()),
};

const { port, amountRed, amountBlue } = workerData;

export class MatchWorker implements IWorker {
    private app = express();
    private server = http.createServer(this.app);
    private io: Server;
    private matchLoader: MatchLoader;
    private turns: Turns;
    private socketHandler: SocketHandler;
    private port: number;

    constructor(port: number, amountRed: number, amountBlue: number) {
        this.io = new Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        this.matchLoader = new MatchLoader(port.toString(), this.io);
        this.turns = new Turns(this.io, this.matchLoader);

        this.socketHandler = new SocketHandler(
            this.io,
            this.matchLoader,
            this.turns
        );

        this.port = port;

        GameSettings.setRedPlayers(amountRed);
        GameSettings.setBluePlayers(amountBlue);
    }

    public start(): void {
        this.io.on("connection", (socket: Socket) =>
            this.socketHandler.handleConnection(socket)
        );
        this.app.use(morgan("combined", { stream: morganStream }));
        this.server.listen(this.port, () => {
            logger.info(`Match running on port ${this.port}`);
        });
    }

    getPlayersAmount(): number {
        return this.matchLoader.getHeroCount();
    }
}

const matchInstance = new MatchWorker(port, amountRed, amountBlue);
matchInstance.start();

parentPort?.on("message", (msg) => {
    if (msg === "getPlayersAmount") {
        const playersAmount = matchInstance.getPlayersAmount();
        parentPort?.postMessage({ type: "playersAmount", data: playersAmount });
    }
});