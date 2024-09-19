import { IEffect } from "../interfaces/effect.interfaces.js";
import { IHero } from "../interfaces/hero.interfaces.js";
import { IMatch } from "../interfaces/match.interfaces.js";
import { IProduct } from "../interfaces/product.interfaces.js";
import { ITeam } from "../interfaces/team.interface.js";
import { IMatchLoader } from "../interfaces/match.loader.interface.js";
import { Match } from "../models/match.model.js";
import { Team } from "../models/team.model.js";
import { NullHero } from "../null_models/null.hero.js";
import { NullProduct } from "../null_models/null.product.js";
import { NullTeam } from "../null_models/null.team.js";
import { calculateDamage } from '../utils/probabilities/probabilities.js';
import {
    AdditionStrategy,
    EffectStrategy,
    MultiplicationStrategy,
    SubtractionStrategy,
} from "../utils/operator.strategy.js";
import { teamSide } from "../types/team.type.js";
import logger from "../utils/logger.js";
import { GameSettings } from "../utils/game.settings.js";
import { Server } from "socket.io";
import { parentPort } from 'worker_threads';
import { AIUtil } from "../utils/ai.js";


const POWER_PER_TURN = 2;

export class MatchLoader implements IMatchLoader {
    private match: IMatch;
    private teams: Map<teamSide, ITeam>;

    private blueTeam: ITeam;
    private redTeam: ITeam;

    private heroMap: Map<string, IHero>;
    private aiMap: Map<string, IHero>;
    private productMap: Map<string, IProduct>;

    private io: Server;

    constructor(matchId: string, io: Server) {
        this.blueTeam = new Team([], "blue", true);
        this.redTeam = new Team([], "red", true);

        this.teams = new Map<teamSide, ITeam>();
        this.teams.set("blue", this.blueTeam);
        this.teams.set("red", this.redTeam);

        this.match = new Match(matchId, this.teams);

        this.heroMap = new Map();
        this.aiMap = new Map();
        this.productMap = new Map();

        this.io = io;
    }

    addPlayerToTeam(hero: IHero): void {
        if (this.heroMap.get(hero.idUser) != undefined) {
            logger.error("trying to add a user that already is here????");
            return;
        }

        if (hero.teamSide == "blue") this.blueTeam.addHero(hero);
        else if (hero.teamSide == "red") this.redTeam.addHero(hero);

        if (this.heroMap.size == 0) this.match.setOwner(hero.idUser);
        this.heroMap.set(hero.idUser, hero);
        hero.products.forEach((product) => {
            if (this.productMap.get(product.idProduct) == undefined)
                this.productMap.set(product.idProduct, product);
        });
    }

    useHability(perpetratorId: string, productId: string, victimId: string): void {
        const perpetrator = this.getHero(perpetratorId);
        const product = this.getProduct(productId);

        if (product == null || perpetrator == null) {
            logger.error("the perpetrator or the product, someone is null, wtf is this code man.");
            return;
        } else if (perpetrator.attributes["power"].value < product.powerCost) {
            logger.error("not enough power? try some perico");
            this.io.emit("failedReason", "¡Fallo! Insuficiente poder");
            return;
        }

        const victim = this.getHero(victimId);
        if (victim == null) {
            logger.error("victim null UnU");
            return;
        }

        this.affectPlayerHealth(perpetrator, victim);
        this.affectSkills(perpetratorId, product, victimId);
        this.affectPlayerPower(perpetrator, product);
    }

    getMatch(): IMatch { return this.match; }

    givePower(heroId: string) {
        const hero = this.heroMap.get(heroId);
        if (hero == undefined) {
            console.error("paila mani no le puedo dar power porque el heroe ni existe en esta partida.");
            return;
        }
        if(hero.attributes["power"].value + POWER_PER_TURN <= hero.attributes["power"].valueConstant) {
            hero.attributes["power"].value += POWER_PER_TURN;
        }
    }

    getSerializedMatch(): unknown {
        return {
            idMatch: this.match.idMatch,
            size: this.match.size,
            teams: Object.fromEntries(this.match.teams),
            owner: this.match.owner,
        };
    }

    getOwner(): string { return this.match.owner; }

    loadAI(): void {
        let playersInBlue: number = this.playersInTeam('blue');
        let playersInRed: number = this.playersInTeam('red');

        if (playersInBlue < GameSettings.getBluePlayers()) {
            logger.info(`adding ${(GameSettings.getBluePlayers() - playersInBlue)} ai's to blue team`);
            for (let i = 0; i < (GameSettings.getBluePlayers() - playersInBlue); i++) {
                AIUtil.addAiToTeam(this.blueTeam, this.aiMap);
            }
        }

        if (playersInRed < GameSettings.getRedPlayers()) {
            logger.info(`adding ${(GameSettings.getBluePlayers() - playersInBlue)} ai's to red team`);
            for (let i = 0; i < (GameSettings.getRedPlayers() - playersInRed); i++) {
                AIUtil.addAiToTeam(this.redTeam, this.aiMap);
            }
        }
    }

    getAiMap(): Map<string, IHero> { return this.aiMap; }

    private playersInTeam(teamSide: teamSide): number {
        let count = 0;
        this.heroMap.forEach((hero) => {
            if (hero.teamSide === teamSide) {
                count++;
            }
        });
        return count;
    }

    private affectSkills(perpetratorId: string, product: IProduct, victimId: string): void {
        const perpetratorSide: ITeam = this.getTeam(perpetratorId);
        const victimSide: ITeam = this.getTeam(victimId);

        if (perpetratorSide == null || victimSide == null) {
            logger.error("the perpetratorTeam or the victimTeam, someone is null, but who can be?? Its sherlock time");
            return;
        }

        const effectTarget = (effect: IEffect) => effect.target === "ally" ? perpetratorSide : victimSide;

        product.effects.forEach((effect) => {
            this.affectTeam(effectTarget(effect), effect);
        });
    }

    private affectPlayerHealth(perpetrator: IHero, victim: IHero): void {
        if (perpetrator.attributes["attack"].value < victim.attributes["defense"].value) {
            logger.info("victim so tanky, no damage taken");
            this.io.emit("failedReason", "¡Fallo! Enemigo muy tanque");
            return;
        }

        const hero = {
            'tipo-heroe': perpetrator.type.toString(),
            'subtipo-heroe': perpetrator.subtype.toString(),
            dano: parseInt((perpetrator.attributes["damage"]).toString()),
            critico: parseInt((perpetrator.attributes["critical"]).toString())
          };
          
        const damageCaused = parseFloat(calculateDamage(hero).toFixed(1));

        logger.info(`${damageCaused} damage caused`)

        if(damageCaused === 0){
            logger.info("perpetrator doesn't hit, victim still alive");
            this.io.emit("failedReason", "¡Fallo! Ataque no efectivo");
            return;
        }

        if (victim.attributes["blood"].value - damageCaused > 0) {
            logger.info("perpetrator hits!, victim still alive");
            victim.attributes["blood"].value -= damageCaused;
            victim.attributes["blood"].value = parseFloat((victim.attributes["blood"].value).toFixed(1))
            return;
        }

        victim.attributes["blood"].value = 0;
        victim.alive = false;

        const victimTeam = this.getTeam(victim.idUser);
        if (victimTeam == null) {
            logger.error("victimTeam null :))))");
            return;
        }

        victimTeam.teamSide === "blue" ? GameSettings.addBlueDead() : GameSettings.addRedDead();
        if (!GameSettings.blueAlive || !GameSettings.redAlive) {
            victimTeam.alive = false;
            this.endMatch(perpetrator.teamSide);
            logger.info("x.x");
            return;
        }
    }

    getTeamWeakest(teamSide: teamSide): IHero {
        const team = this.teams.get(teamSide);

        if (!team) {
            logger.error(`Team ${teamSide} not found`);
            return new NullHero();
        }

        let weakestHero: IHero = team.players[0];

        for (const hero of team.players) {
            const bloodValue: number = hero.attributes['blood'].value;

            if (bloodValue < weakestHero.attributes['blood'].value) weakestHero = hero;
        }

        return this.getHero(weakestHero.idUser);
    }

    private affectPlayerPower(perpetrator: IHero, product: IProduct): void {
        if (perpetrator.attributes["power"].value < product.powerCost) {
            logger.info("not enough power to use the product");
            this.io.emit("failedReason", "¡Fallo! No hay suficiente poder");
            return;
        }
    
        perpetrator.attributes["power"].value -= product.powerCost;
    
        if (perpetrator.attributes["power"].value < 0) {
            perpetrator.attributes["power"].value = 0;
        }
    
        logger.info(`perpetrator used power, remaining power: ${perpetrator.attributes["power"].value}`);
    }

    private getHero(idHero: string): IHero { return this.heroMap.get(idHero) ?? new NullHero(); }

    private getProduct(idProduct: string): IProduct { return this.productMap.get(idProduct) ?? new NullProduct(); }

    private getTeam(idHero: string): ITeam {
        const firstSide = this.teams.get("blue");
        if (firstSide == null) return new NullTeam();

        for (const player of firstSide.players)
            if (player.idUser == idHero) return firstSide;

        const secondSide = this.teams.get("red");
        if (secondSide == null) return new NullTeam();

        for (const player of secondSide.players)
            if (player.idUser == idHero) return secondSide;

        return new NullTeam();
    }

    private affectTeam(side: ITeam, effect: IEffect): void {
        const strategy: EffectStrategy = this.getStrategy(effect.mathOperator);

        side.players.forEach((player) => {
            player.attributes[effect.attribute.name].value =
                strategy.applyEffect(player.attributes[effect.attribute.name].value, effect.value);
        });
    }

    private getStrategy(operator: string): EffectStrategy {
        switch (operator) {
            case "+":
                return new AdditionStrategy();
            case "-":
                return new SubtractionStrategy();
            case "*":
                return new MultiplicationStrategy();
            default:
                throw new Error("Unsupported operator");
        }
    }

    private endMatch(teamSide: teamSide) {
        if (parentPort) {
            parentPort.postMessage({ status: "Match ended.", winner: teamSide })
        }
        this.io.emit("endMatch", teamSide);

        logger.info("todo bien manito hasta aqui llegamos.")
        // process.exit(0);
    }

    getHeroCount(): number {
        return this.heroMap.size;
    }
}
