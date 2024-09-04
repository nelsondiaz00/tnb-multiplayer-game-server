import { IAttribute } from "./attribute.interfaces";
import { targetType } from "../types/effect.type";

export interface IEffect {
    attribute: IAttribute;
    mathOperator: string;
    turns: number;
    target: targetType;
    value: number;
    valueCaused: number;

    accumulateValue(): void;
}
