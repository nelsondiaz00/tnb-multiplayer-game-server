import { ITurn } from "../interfaces/turn.interface";
import { teamSide } from "../types/team.type";

export class Turn implements ITurn {
    side: teamSide;
    idUser: string;

    constructor(side: teamSide, idUser: string) {
        this.side = side;
        this.idUser = idUser;
    }
}