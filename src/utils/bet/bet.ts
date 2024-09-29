import { Hero } from "../../models/hero.model";

export class Bet {
    private playerRed: Hero;
    private playerBlue: Hero;
    private betAmount: number;

    constructor(playerRed: Hero, playerBlue: Hero, betAmount: number) {
        this.playerRed = playerRed;
        this.playerBlue = playerBlue;
        this.betAmount = betAmount;
    }

    // Verifica si ambos jugadores tienen suficientes créditos para apostar
    canPlayersBet(): boolean {
        return this.playerRed.hasSufficientCredits(this.betAmount) &&
               this.playerBlue.hasSufficientCredits(this.betAmount);
    }

}
