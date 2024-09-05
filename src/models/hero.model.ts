import { Attribute } from "./attribute.model";
import { heroType } from "../types/hero.type";
import { subHeroType } from "../types/hero.type";
import { IHero } from "../interfaces/hero.interfaces";
import { IAttribute } from "../interfaces/attribute.interfaces";
import { IProduct } from "../interfaces/product.interfaces";
import { teamSide } from "../types/team.type";

export class Hero implements IHero {
    public idUser: string;
    public type: heroType;
    public subtype: subHeroType;
    public attributes: { [key: string]: IAttribute };
    public products: IProduct[];
    public alive: boolean;
    public teamSide: teamSide;

    constructor(
        idUser: string,
        type: heroType,
        subtype: subHeroType,
        attributesArray: IAttribute[],
        products: IProduct[],
        teamSide: teamSide
    ) { 
        this.idUser = idUser;
        this.type = type;
        this.subtype = subtype;
        this.attributes = this.createAttributesMap(
            attributesArray.map((attr) => attr.clone()),
        );
        this.products = products;
        this.alive = true;
        this.teamSide = teamSide;
    }

    isNull(): boolean { return false; }

    private createAttributesMap(attributes: IAttribute[]): {
        [key: string]: Attribute;
    } {
        return attributes.reduce(
            (map, attr) => {
                map[attr.name] = attr;
                return map;
            },
            {} as { [key: string]: Attribute },
        );
    }
}
