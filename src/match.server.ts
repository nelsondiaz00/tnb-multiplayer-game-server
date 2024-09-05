import express from "express";
import morgan from "morgan";
import http from "node:http";
import { Server, Socket } from "socket.io";
import { BindInfo } from "./models/bind.model";
import { MatchLoader } from "./helper/match.loader";
import { IMatchLoader } from "./interfaces/match.loader.interface";
import { ITurns } from "./interfaces/turns.interface";
import { Turns } from "./helper/turns";
import logger from "./utils/logger";
import { GameSettings } from "./utils/game.settings";

const morganStream = {
    write: (message: string) => logger.info(message.trim()),
};

export class MatchServer {
    private app = express();
    private server = http.createServer(this.app);
    private io: Server = new Server(this.server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    private port = process.env.Port ?? 3000;

    private matchLoader: IMatchLoader;
    private turns: ITurns;

    constructor(amountRed: number, amountBlue: number) {
        GameSettings.setBluePlayers(amountBlue);
        GameSettings.setRedPlayers(amountRed);

        this.matchLoader = new MatchLoader();
        this.turns = new Turns(this.io);
    }

    deploy(): void {
        this.io.on("connection", (socket: Socket) => {
            logger.info("a user has connected!", socket.id);

            socket.on("bindInfo", (bindInfo: BindInfo) => {
                logger.info("Información recibida: ", bindInfo);

                // Agrega al jugador al equipo
                this.matchLoader.addPlayerToTeam(bindInfo);

                // Obtén el objeto IMatch
                const match = this.matchLoader.getMatch();

                // Convierte el Map a un objeto simple
                const matchSerializable = {
                    idMatch: match.idMatch,
                    size: match.size,
                    teams: Object.fromEntries(match.teams), // Convierte el Map a un objeto
                };

                // Emite el evento con el objeto serializado a JSON
                this.io.emit("newUser", matchSerializable);
            });

            socket.on("startBattle", () => {
                //io.emit("startBattle", msg);
                this.turns.startTurnRotation(this.matchLoader.getMatch());
            });

            socket.on("passTurn", () => {
                this.turns.callNextTurn();
            });

            socket.on(
                "useHability",
                (
                    perpetratorId: string,
                    productId: string,
                    victimId: string
                ) => {
                    console.log(
                        perpetratorId,
                        " - ",
                        productId,
                        " - ",
                        victimId
                    );
                    this.matchLoader.affectPlayerHealth(
                        perpetratorId,
                        victimId
                    );
                    this.matchLoader.affectSkills(
                        perpetratorId,
                        productId,
                        victimId
                    );

                    const match = this.matchLoader.getMatch();
                    const matchSerializable = {
                        idMatch: match.idMatch,
                        size: match.size,
                        teams: Object.fromEntries(match.teams),
                    };
                    this.io.emit("actualMatch", matchSerializable);
                }
            );

            socket.on("getMatch", () => {
                this.io.emit("actualMatch", this.matchLoader.getMatch());
            });

            socket.on("disconnect", () => {
                logger.info(`The user ${socket.id} has disconnected.`);
            });
        });

        this.app.use(morgan("combined", { stream: morganStream }));

        this.server.listen(this.port, () => {
            logger.info(`Server running on port ${this.port}`);
            // console.log(`Server running on port ${this.port}`);
        });
    }
}
