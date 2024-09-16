import { attributeName } from "../types/attribute.type.js";

export interface IAttribute {
    name: attributeName;
    value: number;
    valueMin: number;
    valueMax: number;
    valueConstant: number;

    // esto si se usa?
    clone(): IAttribute;
    changeOnValue(): number;
    getValueChangement(): number;
    getValueConstant(): number;
}
