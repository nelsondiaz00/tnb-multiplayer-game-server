import { IMatch } from "./match.interfaces";
import { BindInfo } from "../models/bind.model";

export interface IMatchLoader {
    addPlayerToTeam(bindInfo: BindInfo): void;
    getMatch(): IMatch;
    affectSkills(perpetratorId: string, productId: string, victimId: string): void;
    affectPlayerHealth(perpetratorId: string, victimId: string): void;
}