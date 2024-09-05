import { Hero } from "../models/hero.model";

export class NullHero extends Hero {
    constructor() {
        super("idUser", "rogue", "fire", [], [], "blue");
    }

    isNull(): boolean { return true; }
}