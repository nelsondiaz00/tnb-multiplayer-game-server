// import { IAttribute } from "../interfaces/attribute.interfaces";
import { IHero } from "../interfaces/hero.interfaces";
import { ITeam } from "../interfaces/team.interface";
// import { Hero } from "../models/hero.model";
// import { heroType, subHeroType } from "../types/hero.type";
// import logger from "./logger";

// const POWER_MAX_VAL = 100;

export class AIUtil {
    static addAiToTeam(team: ITeam, aiMap: Map<string, IHero>): void {
        console.log(team, aiMap);
        // seleccionar algun heroe ia y agregarlo al equipo y al mapa
        // const newAiHero: IHero = new Hero(randomId, randomType, randomSubType, randomAttributes, [], team.teamSide);
        // team.addHero(newAiHero);
        // aiMap.set(randomId, newAiHero);

        // logger.info(`AI Hero added to ${team.teamSide} team with id: ${randomId}`);
    }

    // parsea los datos del heroe a como los recibe la api
    static callAiAPI(aiHero: IHero, victim: IHero): string {
        // let toReturn: string = AIUtil.filterHabilityByHero(aiHero, []);
        console.log(aiHero, victim);

        return "pailaLaApiNoRespondioPaseTurnoPorqueQueMas";
    }

    // revisa si el heroe tiene la habilidad, regresa la primera habilidad que tenga
    static filterHabilityByHero(aiHero: IHero, habilities: string[]): string {
        console.log(aiHero, habilities);

        return "some_thing"
    }
}