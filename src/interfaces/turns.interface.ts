import { IMatch } from "./match.interfaces";

export interface ITurns {
    startTurnRotation(matchInfo: IMatch): void;
    callNextTurn(): void;
}