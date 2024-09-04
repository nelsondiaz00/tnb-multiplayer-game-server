import { Attribute } from "./attribute.model";
import { targetType } from "../types/effect.type";
import { IEffect } from "../interfaces/effect.interfaces";

export class Effect implements IEffect {
    public attribute: Attribute;
    public mathOperator: string;
    public turns: number;
    public target: targetType;
    public value: number;
    public valueCaused: number;
    // product: Product | null; req. future

    constructor(
        attribute: Attribute,
        mathOperator: string,
        turns: number,
        target: targetType,
        value: number,
        // product: Product | null req. futuro
    ) {
        this.attribute = attribute;
        this.mathOperator = mathOperator;
        this.turns = turns;
        this.target = target;
        // this.product = product; req. future
        this.value = value;
        this.valueCaused = 0;
    }

    accumulateValue() {
        this.valueCaused += this.value;
    }
}
