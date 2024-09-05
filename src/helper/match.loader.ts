import { IEffect } from "../interfaces/effect.interfaces";
import { IHero } from "../interfaces/hero.interfaces";
import { IMatch } from "../interfaces/match.interfaces";
import { IProduct } from "../interfaces/product.interfaces";
import { ITeam } from "../interfaces/team.interface";
import { IMatchLoader } from "../interfaces/match.loader.interface";
import { BindInfo } from "../models/bind.model";
import { Match } from "../models/match.model";
import { Team } from "../models/team.model";
import { NullHero } from "../null_models/null.hero";
import { NullProduct } from "../null_models/null.product";
import { NullTeam } from "../null_models/null.team";
import {
    AdditionStrategy,
    EffectStrategy,
    MultiplicationStrategy,
    SubtractionStrategy,
} from "../utils/operator.strategy";
import { teamSide } from "../types/team.type";
import logger from "../utils/logger";
import { GameSettings } from "../utils/game.settings";

export class MatchLoader implements IMatchLoader {
    private match: IMatch;
    private teams: Map<teamSide, ITeam>;

    private blueTeam: ITeam;
    private redTeam: ITeam;

    private heroMap: Map<string, IHero>;
    private productMap: Map<string, IProduct>;

    constructor() {
        this.blueTeam = new Team([], "blue", true);
        this.redTeam = new Team([], "red", true);

        this.teams = new Map<teamSide, ITeam>();
        this.teams.set("blue", this.blueTeam);
        this.teams.set("red", this.redTeam);

        this.match = new Match("TODO", this.teams);

        this.heroMap = new Map();
        this.productMap = new Map();
    }

    addPlayerToTeam(bindInfo: BindInfo): void {
        if (this.heroMap.get(bindInfo.hero.idUser) != undefined) {
            logger.error("trying to add a user that already is here????");
            return;
        }

        if (bindInfo.teamSide == "blue") this.blueTeam.addHero(bindInfo.hero);
        else if (bindInfo.teamSide == "red")
            this.redTeam.addHero(bindInfo.hero);

        this.heroMap.set(bindInfo.hero.idUser, bindInfo.hero);

        bindInfo.hero.products.forEach((product) => {
            if (this.productMap.get(product.idProduct) == undefined)
                this.productMap.set(product.idProduct, product);
        });
    }

    affectSkills(
        perpetratorId: string,
        productId: string,
        victimId: string
    ): void {
        const product: IProduct = this.getProduct(productId);
        if (product === null) {
            logger.error("the product is null, guess that shouldnt happen");
            return;
        }

        const perpetratorSide: ITeam = this.getTeam(perpetratorId);
        if (perpetratorSide.isNull()) {
            logger.error(
                "the perpetrator team is null, guess that shouldnt happen"
            );
            return;
        }

        const victimSide: ITeam = this.getTeam(victimId);
        if (victimSide.isNull()) {
            logger.error("the victim team is null, guess that shouldnt happen");
            return;
        }

        const effectTarget = (effect: IEffect) =>
            effect.target === "ally" ? perpetratorSide : victimSide;

        product.effects.forEach((effect) => {
            this.affectTeam(effectTarget(effect), effect);
        });
    }

    affectPlayerHealth(perpetratorId: string, victimId: string): void {
        const perpetrator: IHero = this.getHero(perpetratorId);
        const victim: IHero = this.getHero(victimId);

        // console.log(
        //     perpetrator,
        //     " PERPEPERPEPERPEPERPEPERPEPERPEPERPEPERPEPERPE"
        // );
        // console.log(victim, " VICTIMAVICTIMAVICTIMAVICTIMAVICTIMAVICTIMA");

        if (perpetrator === null || victim === null) {
            logger.error(
                "the perpetrator or the victim, someone is null, wtf is this code man."
            );
            return;
        }

        if (
            perpetrator.attributes["attack"].value <
            victim.attributes["defense"].value
        ) {
            logger.info("victim is so tanky, no damage taken");
            return;
        }
        if (
            victim.attributes["blood"].value -
                perpetrator.attributes["attack"].value >
            0
        ) {
            logger.info("perpetrator hits!, victim still alive");
            victim.attributes["blood"].value -=
                perpetrator.attributes["attack"].value;
            return;
        }

        victim.attributes["blood"].value = 0;
        victim.alive = false;

        const victimTeam = this.getTeam(victimId);
        if (victimTeam.isNull()) {
            logger.error("victimTeam null :))))");
            return;
        }

        victimTeam.teamSide === "blue"
            ? GameSettings.addBlueDead()
            : GameSettings.addRedDead();
        // console.log(GameSettings.blueAlive, " -- ", GameSettings.redAlive);
        if (!GameSettings.blueAlive || !GameSettings.redAlive) {
            victimTeam.alive = false;
            //endMatch()?
            logger.info("x.x");
        }
    }

    private getHero(idHero: string): IHero {
        return this.heroMap.get(idHero) ?? new NullHero();
    }

    private getProduct(idProduct: string): IProduct {
        return this.productMap.get(idProduct) ?? new NullProduct();
    }

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

    getMatch(): IMatch {
        return this.match;
    }

    private affectTeam(side: ITeam, effect: IEffect): void {
        const strategy: EffectStrategy = this.getStrategy(effect.mathOperator);

        side.players.forEach((player) => {
            //  console.log(effect, " playerplayerplayerplayerplayerplayer");
            player.attributes[effect.attribute.name].value =
                strategy.applyEffect(
                    player.attributes[effect.attribute.name].value,
                    effect.value
                );
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
}
