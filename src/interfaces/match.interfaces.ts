import { teamSide } from "../types/team.type";
import { ITeam } from "./team.interface";

export interface IMatch {
    idMatch: string;
    teams: Map<teamSide, ITeam>;
    size: number;
}
