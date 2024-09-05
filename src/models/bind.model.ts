import { IBindInfo } from "../interfaces/bind.info.interface";
import { IHero } from "../interfaces/hero.interfaces";
import { teamSide } from "../types/team.type";

export class BindInfo implements IBindInfo {
    public hero: IHero;
    public teamSide: teamSide;

    constructor(hero: IHero, teamSide: teamSide) {
        this.hero = hero;
        this.teamSide = teamSide;
    }
}