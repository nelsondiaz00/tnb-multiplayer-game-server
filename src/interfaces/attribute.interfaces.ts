import { attributeName } from "../types/attribute.type.js";

export interface IAttribute {
    name: attributeName;
    value: number;
    valueMin: number;
    valueMax: number;
    valueConstant: number;

    clone(): IAttribute;
    changeOnValue(): number;
    getValueChangement(): number;
    getValueConstant(): number;
}
