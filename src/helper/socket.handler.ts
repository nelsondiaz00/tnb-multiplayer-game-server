import { Server, Socket } from "socket.io";
import { IMatchLoader } from "../interfaces/match.loader.interface.js";
import { ITurns } from "../interfaces/turns.interface.js";
import logger from "../utils/logger.js";
import { IHero } from "../interfaces/hero.interfaces.js";

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
        socket.on("startBattle", (idUser: string) => this.handleStartBattle(idUser));
        socket.on("passTurn", () => this.turns.callNextTurn());
        socket.on("useHability", (perpetratorId, productId, victimId) => this.handleUseHability(perpetratorId, productId, victimId));
        socket.on("getMatch", () => this.io.emit("actualMatch", this.matchLoader.getMatch()));
        socket.on("disconnect", () => logger.info(`The user ${socket.id} has disconnected.`));
    }

    private handleBindInfo(hero: IHero): void {
        this.matchLoader.addPlayerToTeam(hero);
        const match = this.matchLoader.getSerializedMatch();
        this.io.emit("newUser", match);
        logger.info(`emited ${match}`);
    }

    private handleStartBattle(idUser: string): void {
        if (this.matchLoader.getOwner() == idUser) {
            this.matchLoader.loadAI();
            this.turns.startTurnRotation(this.matchLoader.getMatch());
        }
        else logger.info("pailangas tangas al intentar iniciar la batalla");
    }

    private async handleUseHability(perpetratorId: string, productId: string, victimId: string): Promise<void> {
        await this.matchLoader.useHability(perpetratorId, productId, victimId);
        this.io.emit("actualMatch", this.matchLoader.getSerializedMatch());
    }
}