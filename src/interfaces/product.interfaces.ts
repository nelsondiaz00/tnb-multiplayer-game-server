import { heroType, subHeroType } from "../types/hero.type";
import { productType } from "../types/product.type";
import { IAttribute } from "./attribute.interfaces";
import { ICondition } from "./condition.interface";
import { IEffect } from "./effect.interfaces";
import { IHero } from "./hero.interfaces";

export interface IProduct {
    idProduct: string;
    productName: string;
    productDescription: string;
    productType: productType;
    heroType: heroType;
    subHeroType: subHeroType;
    dropChance: string;
    effects: IEffect[];
    conditions: ICondition[];
    imagePath: string;
    powerCost: number;

    useProduct(target: IHero): { [key: string]: IAttribute };
    isNull(): boolean;
}
