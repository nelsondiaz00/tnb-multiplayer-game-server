import { workerData } from 'worker_threads';
import express from "express";
import morgan from "morgan";
import http from "node:http";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";
import { SocketHandler } from "./helper/socket.handler";
import { MatchLoader } from "./helper/match.loader";
import { Turns } from "./helper/turns";
import { GameSettings } from "./utils/game.settings";

const morganStream = {
    write: (message: string) => logger.info(message.trim()),
};

const { port, amountRed, amountBlue } = workerData;

export class MatchWorker {
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
        // aqui le puedo pasar matchLoader a turns para que le de power
        this.turns = new Turns(this.io, this.matchLoader);

        this.socketHandler = new SocketHandler(this.io, this.matchLoader, this.turns);

        this.port = port;

        GameSettings.setRedPlayers(amountRed);
        GameSettings.setBluePlayers(amountBlue);
    }

    public start(): void {
        this.io.on("connection", (socket: Socket) => this.socketHandler.handleConnection(socket));
        this.app.use(morgan("combined", { stream: morganStream }));
        this.server.listen(this.port, () => {
            logger.info(`Match running on port ${this.port}`);
        });
    }
}

const matchInstance = new MatchWorker(port, amountRed, amountBlue);
matchInstance.start();