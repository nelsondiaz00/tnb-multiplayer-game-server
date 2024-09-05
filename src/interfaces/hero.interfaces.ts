import { IProduct } from "./product.interfaces";
import { heroType, subHeroType } from "../types/hero.type";
import { IAttribute } from "./attribute.interfaces";
import { teamSide } from "../types/team.type";

export interface IHero {
    idUser: string;
    type: heroType;
    subtype: subHeroType;
    attributes: { [key: string]: IAttribute };
    products: IProduct[];
    alive: boolean;
    teamSide: teamSide;

    isNull(): boolean;
}
