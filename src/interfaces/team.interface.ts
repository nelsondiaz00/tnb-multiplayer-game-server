import { teamSide } from "../types/team.type";
import { IHero } from "./hero.interfaces";

export interface ITeam {
    players: IHero[];
    teamSide: teamSide;
    alive: boolean;

    addHero(hero: IHero): void;
    isNull(): boolean;
}
