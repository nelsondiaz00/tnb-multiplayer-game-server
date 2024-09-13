import { IMatch } from "./match.interfaces.js";
import { IHero } from "./hero.interfaces.js";

export interface IMatchLoader {
    addPlayerToTeam(hero: IHero): void;
    getMatch(): IMatch;
    useHability(perpetratorId: string, productId: string, victimId: string): void;
    givePower(heroId: string): void;
    getHeroCount(): number;
}