import { IAttribute } from "../interfaces/attribute.interfaces";
import { IHero } from "../interfaces/hero.interfaces";
import { ITeam } from "../interfaces/team.interface";
import { Hero } from "../models/hero.model";
import { heroType, subHeroType } from "../types/hero.type";
import logger from "./logger";

const POWER_MAX_VAL = 100;

export class AIUtil {
    static addAiToTeam(team: ITeam, aiMap: Map<string, IHero>): void {
        const types: heroType[] = ['warrior', 'wizard', 'rogue'];
        const randomType = types[Math.floor(Math.random() * types.length)];

        const subTypes: subHeroType[] = ['tank', 'weapon', 'fire', 'ice', 'poison', 'machete'];
        const randomSubType = subTypes[Math.floor(Math.random() * subTypes.length)];

        const randomId = `ai_${randomType}${randomSubType}${Math.random().toString(36).slice(2, 11)}`;

        const randomAttributes: IAttribute[] = [
            { name: 'power', value: Math.floor(Math.random() * 100), valueMin: 0, valueMax: 100, valueConstant: 100, clone() { return { ...this }; }, changeOnValue() { return this.value; }, getValueChangement() { return this.valueMax; }, getValueConstant() { return this.valueConstant; } },
            { name: 'health', value: Math.floor(Math.random() * 100), valueMin: 0, valueMax: 100, valueConstant: 100, clone() { return { ...this }; }, changeOnValue() { return this.value; }, getValueChangement() { return this.valueMax; }, getValueConstant() { return this.valueConstant; } }
            // Puedes agregar más atributos según la definición
    ];

    const newAiHero: IHero = new Hero(randomId, randomType, randomSubType, randomAttributes, [], team.teamSide);
    team.addHero(newAiHero);
    aiMap.set(randomId, newAiHero);

    logger.info(`AI Hero added to ${team.teamSide} team with id: ${randomId}`);
    }

    // parsea los datos del heroe a como los recibe la api
    static callAiAPI(aiHero: IHero, victim: IHero): string {
        let toReturn: string = AIUtil.filterHabilityByHero(aiHero, []);

        return "pailaLaApiNoRespondioPaseTurnoPorqueQueMas";
    }

    // revisa si el heroe tiene la habilidad, regresa la primera habilidad que tenga
    static filterHabilityByHero(aiHero: IHero, habilities: string[]): string {
        return "some_thing"
    }
}