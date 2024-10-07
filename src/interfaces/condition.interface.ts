import { attributeName } from '../types/attribute.type';
export interface ICondition {
  attribute1: attributeName;
  attribute2: attributeName;
  logicOperator: string;
}
