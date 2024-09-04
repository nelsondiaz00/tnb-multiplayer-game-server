import { Team } from "../models/team.model";

export class NullTeam extends Team {
    constructor() {
        super([], 'blue', false);
    }

    isNull(): boolean { return true; }
}