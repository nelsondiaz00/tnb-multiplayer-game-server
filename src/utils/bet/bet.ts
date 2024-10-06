import { Hero } from "../../models/hero.model";

export class Bet {
    private playerRed: Hero;
    private playerBlue: Hero;
    private betAmount: number;
    private earning: number;

    constructor(playerRed: Hero, playerBlue: Hero, betAmount: number) {
        this.playerRed = playerRed;
        this.playerBlue = playerBlue;
        this.betAmount = betAmount;
        this.earning = this.calculateEarning(); // Calcula la ganancia potencial.
    }

    // Verifica si ambos jugadores tienen suficientes créditos para apostar
    canPlayersBet(): boolean {
        return this.playerRed.hasSufficientCredits(this.betAmount) && this.playerBlue.hasSufficientCredits(this.betAmount);
    }

    // Calcula la ganancia total (la suma de ambas apuestas)
    private calculateEarning(): number {
        return this.betAmount * 2;
    }

    // Deduce créditos de ambos jugadores
    placeBet(): void {
        if (this.canPlayersBet()) {
            this.playerRed.deductCredits(this.betAmount);
            this.playerBlue.deductCredits(this.betAmount);
        } else {
            throw new Error("Uno o ambos jugadores no tienen suficientes créditos para apostar.");
        }
    }

    // Método para retribuir la ganancia al ganador
    earningForWinner(winner: Hero): number {
        if (winner === this.playerBlue) {
            this.playerBlue.addCredits(this.earning); // Añade la ganancia al jugador azul
        } else if (winner === this.playerRed) {
            this.playerRed.addCredits(this.earning); // Añade la ganancia al jugador rojo
        } else {
            throw new Error("El ganador no es válido.");
        }

        return this.earning; // Retorna la cantidad ganada
    }
}
