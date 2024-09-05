import { IAttribute } from "./attribute.interfaces";

export interface ICondition {
    attribute1: IAttribute;
    attribute2: IAttribute;
    logicOperator: string;
}
