import { IAttribute } from "../interfaces/attribute.interfaces";
import { attributeName } from "../types/attribute.type";
export class Attribute implements IAttribute {
    public name: attributeName;
    public value: number;
    public valueMin: number;
    public valueMax: number;
    public valueConstant: number;

    constructor(
        name: attributeName,
        value: number,
        valueMin: number,
        valueMax: number
    ) {
        this.name = name;
        this.valueConstant = value;
        this.valueMin = valueMin;
        this.valueMax = valueMax;
        this.value = value;
    }

    public getValueConstant(): number {
        // Getter for valueConstant
        return this.valueConstant;
    }

    // set value(val: number) {
    //     if (val >= 0) {
    //         this._value = val;
    //     } else {
    //         console.error("attribute can't be negative");
    //     }
    // }

    public clone(): IAttribute {
        return new Attribute(
            this.name,
            this.value,
            this.valueMin,
            this.valueMax
        );
    }

    public changeOnValue(): number {
        return this.value - this.valueConstant;
    }

    public getValueChangement() {
        return (
            this.value +
            Math.floor(
                Math.random() * (this.valueMax - this.valueMin + 1) +
                    this.valueMin
            )
        );
    }
}
