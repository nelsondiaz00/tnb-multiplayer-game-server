import { IProduct } from "./product.interfaces";
import { heroType, subHeroType } from "../types/hero.type";
import { IAttribute } from "./attribute.interfaces";

export interface IHero {
    idUser: string;
    type: heroType;
    subtype: subHeroType;
    attributes: { [key: string]: IAttribute };
    products: IProduct[];
    alive: boolean;

    isNull(): boolean;
}
