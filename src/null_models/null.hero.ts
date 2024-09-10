import { Hero } from "../models/hero.model.js";

export class NullHero extends Hero {
    constructor() {
        super("idUser", "rogue", "fire", [], [], "blue");
    }

    isNull(): boolean { return true; }
}