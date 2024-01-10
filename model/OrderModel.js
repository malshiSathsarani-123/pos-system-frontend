export class OrderModel {
    constructor(itemCode, description, price, orderQty, total) {
        this.itemCode = itemCode;
        this.description = description;
        this.price = price;
        this.orderQty = orderQty;
        this.total = total;
    }
}
