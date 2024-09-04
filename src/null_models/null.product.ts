import { Product } from "../models/product.model";

export class NullProduct extends Product {
    constructor() {
        super('idProduct', 'productName', 'productDescription', 'item', 
            'rogue', 'fire', 'dropChance', [], [], 'imagePath');
    }

    isNull(): boolean { return true; }
}