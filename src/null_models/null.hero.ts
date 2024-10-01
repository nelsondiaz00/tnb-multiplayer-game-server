import { Hero } from "../models/hero.model.js";

export class NullHero extends Hero {
    constructor() {
        super("idUser", "rogue", "fire", [], [], "blue",0);//Se agrego el 0 de los creditos
    }

    isNull(): boolean { return true; }
}