import { teamSide } from "../types/team.type";
import { IMatch } from "../interfaces/match.interfaces";
import { ITeam } from "../interfaces/team.interface";

export class Match implements IMatch {
    public idMatch: string;
    public teams: Map<teamSide, ITeam>;
    public size: number;

    constructor(idMatch: string, teams: Map<teamSide, ITeam>) {
        this.teams = teams;
        this.idMatch = idMatch;
        this.size = teams.size;
    }
    // simulacion de juego
    startGame() {
        console.log("Bienvenindos a The Nexus Battle III");
        this.setTurns();

        // while (this.size > 1) {

        // }
    }

    setTurns(): void {
        this.teams.forEach((team: ITeam) => {
            for (let i = team.players.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [team.players[i], team.players[j]] = [
                    team.players[j],
                    team.players[i],
                ];
            }
        });
    }
}
