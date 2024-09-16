import { IMatch } from "./match.interfaces.js";
import { IHero } from "./hero.interfaces.js";
import { teamSide } from "../types/team.type.js";

export interface IMatchLoader {
    addPlayerToTeam(hero: IHero): void;
    getMatch(): IMatch;
    getSerializedMatch(): unknown;
    useHability(perpetratorId: string, productId: string, victimId: string): void;
    givePower(heroId: string): void;
    getHeroCount(): number;
    getOwner(): string;
    loadAI(): void;
    getAiMap(): Map<string, IHero>;
    getTeamWeakest(teamSide: teamSide): IHero;
    //getHero(idHero: string): IHero;
}