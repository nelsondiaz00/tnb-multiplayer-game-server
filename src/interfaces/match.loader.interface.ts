import { IMatch } from "./match.interfaces";
import { IHero } from "./hero.interfaces";

export interface IMatchLoader {
    addPlayerToTeam(hero: IHero): void;
    getMatch(): IMatch;
    useHability(perpetratorId: string, productId: string, victimId: string): void;
    givePower(heroId: string): void;
}