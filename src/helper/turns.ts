import { Server } from "socket.io";
import { ITurns } from "../interfaces/turns.interface.js";
import { IMatch } from "../interfaces/match.interfaces.js";
import { Turn } from "../models/turn.model.js";
import { ITurn } from "../interfaces/turn.interface.js";
import { TurnNotifier } from "../utils/turn.notifier.js";
import logger from "../utils/logger.js";
import { IMatchLoader } from "../interfaces/match.loader.interface.js";

const TURN_DURATION_MS = 5000;

export class Turns implements ITurns {
    private rotationStarted: boolean = false;
    private turnTimeout!: NodeJS.Timeout;
    // = setTimeout(() => {}, 0)
    private nextTurnFunction!: () => void;
    private circularList: ITurn[] = [];
    private turnNotifier: TurnNotifier;
    private matchLoader: IMatchLoader;

    constructor(io: Server, matchLoader: IMatchLoader) {
        this.turnNotifier = new TurnNotifier(io);
        this.matchLoader = matchLoader;
    }

    private updateCircularList(matchInfo: IMatch) {
        const blueTeam = matchInfo.teams.get("blue");
        if (blueTeam == undefined) {
            logger.error("Looks like blueTeam does not exist:)");
            return;
        }

        const redTeam = matchInfo.teams.get("red");
        if (redTeam == undefined) {
            logger.error(
                "Looks like redTeam does not exist, you are really good at this arent u."
            );
            return;
        }

        const bluePlayers = blueTeam.players;
        const redPlayers = redTeam.players;

        const maxLength = Math.max(bluePlayers.length, redPlayers.length);

        for (let i = 0; i < maxLength; i++) {
            if (i < bluePlayers.length)
                this.circularList.push(new Turn("blue", bluePlayers[i].idUser));

            if (i < redPlayers.length)
                this.circularList.push(new Turn("red", redPlayers[i].idUser));
        }
    }

    startTurnRotation(matchInfo: IMatch): void {
        if (this.rotationStarted) return;
        this.updateCircularList(matchInfo);

        let index = 0;

        const nextTurn = () => {
            const currentUser = this.circularList[index];
            this.turnNotifier.notifyTurn(currentUser);
            this.matchLoader.givePower(currentUser.idUser);

            index = (index + 1) % this.circularList.length;

            //clearTimeout(this.turnTimeout);
            this.turnTimeout = setTimeout(nextTurn, TURN_DURATION_MS);
        };

        nextTurn();

        this.nextTurnFunction = () => {
            clearTimeout(this.turnTimeout);
            nextTurn();
        };

        this.rotationStarted = true;
    }

    callNextTurn(): void {
        if (this.rotationStarted) this.nextTurnFunction();
        else
            logger.info(
                "Take it easy man, the rotation has to be started yet."
            );
    }
}
