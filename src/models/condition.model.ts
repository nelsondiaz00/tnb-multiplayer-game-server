// import { Product } from "./product.model";
import * as math from "mathjs";
import { ICondition } from "../interfaces/condition.interface.js";
import { attributeName } from "../types/attribute.type.js";

export class Condition implements ICondition {
    //requiredProduct: Product;
    public attribute1: attributeName;
    public attribute2: attributeName;
    public logicOperator: string;

    constructor(
        // requiredProduct: Product,
        attribute1: attributeName,
        attribute2: attributeName,
        logicOperator: string,
    ) {
        //this.requiredProduct = requiredProduct;
        this.attribute1 = attribute1;
        this.attribute2 = attribute2;
        this.logicOperator = logicOperator;
    }

    public evaluateCondition(): boolean {
        const result = this.attribute1 + this.logicOperator + this.attribute2;
        return math.evaluate(result);
    }
}
