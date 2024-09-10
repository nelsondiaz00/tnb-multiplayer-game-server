import { Server, Socket } from "socket.io";
import { IMatchLoader } from "../interfaces/match.loader.interface.js";
import { ITurns } from "../interfaces/turns.interface.js";
import logger from "../utils/logger.js";
import { IHero } from "../interfaces/hero.interfaces.js";
import { IMatch } from "../interfaces/match.interfaces.js";

export class SocketHandler {
    private io: Server;
    private matchLoader: IMatchLoader;
    private turns: ITurns;

    constructor(io: Server, matchLoader: IMatchLoader, turns: ITurns) {
        this.io = io;
        this.matchLoader = matchLoader
        this.turns = turns;
    }

    public handleConnection(socket: Socket): void {
        logger.info("a user has connected!", socket.id);

        socket.on("bindInfo", (hero: IHero) => this.handleBindInfo(hero));
        socket.on("startBattle", () => this.handleStartBattle());
        socket.on("passTurn", () => this.turns.callNextTurn());
        socket.on("useHability", (perpetratorId, productId, victimId) => this.handleUseHability(perpetratorId, productId, victimId));
        socket.on("getMatch", () => this.io.emit("actualMatch", this.matchLoader.getMatch()));
        socket.on("disconnect", () => logger.info(`The user ${socket.id} has disconnected.`));
    }

    private handleBindInfo(hero: IHero): void {
        // logger.info(`info: ${JSON.stringify(hero)}`);
        // logger.info("meme");
        // logger.info("Información recibida: ", hero);
        // console.log("acá llega");
        // console.log("acá no");
        // console.log("acá no");
        this.matchLoader.addPlayerToTeam(hero);
        
        const match = this.matchLoader.getMatch();
        this.io.emit("newUser", this.serializeMatch(match));
        console.log("emitido", this.serializeMatch(match));
    }

    private handleStartBattle(): void {
        this.turns.startTurnRotation(this.matchLoader.getMatch());
    }

    private handleUseHability(perpetratorId: string, productId: string, victimId: string): void {
        this.matchLoader.useHability(perpetratorId, productId, victimId);
        this.io.emit("actualMatch", this.serializeMatch(this.matchLoader.getMatch()));
    }

    private serializeMatch(match: IMatch): unknown {
        return {
            idMatch: match.idMatch,
            size: match.size,
            teams: Object.fromEntries(match.teams),
        };
    }
}