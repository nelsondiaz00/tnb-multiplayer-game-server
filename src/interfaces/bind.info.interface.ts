import { teamSide } from "../types/team.type";
import { IHero } from "./hero.interfaces";

export interface IBindInfo {
    hero: IHero;
    teamSide: teamSide;
}