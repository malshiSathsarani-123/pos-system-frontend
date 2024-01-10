import {OrderModel} from "../model/OrderModel.js";
import {ItemModel} from "../model/ItemModel.js";
import {order_db} from "../db/db.js";
import {customer_db} from "../db/db.js";
import {item_db} from "../db/db.js";

var row_index = null;

const clear = () => {
    $("#description-order").val("");
    $("#price-order").val("");
    $("#orderQty").val("");
    $("#qty-order").val("");
    $("#item-Code").val("")
}

const netTotal = (total) => {
    let netTotal = parseFloat($("#total").val());
    let newTotal = (netTotal+total);
    $("#total").val(newTotal);

}
// const netTotal = (total) => {
//     let netTotal = parseFloat($("#total").val());
//     let newTotal = netTotal + total;
//     $("#total").val(newTotal);
// }

const loadOrderData = () => {
    $('#order-table-body').empty();
    order_db.map((item, index) => {
        let record = `<tr><td class="itemCode">${item.itemCode}</td><td class="description">${item.description}</td><td class="price">${item.price}</td><td class="orderQty">${item.orderQty}
        </td><td class="total">${item.total}</td></tr>`;
        $("#order-table-body").append(record);
    });
};

// submit
$("#add-button>button[type='button']").eq(0).on("click", () => {
    let itemCode = $("#item-Code").val();
    let description = $("#description-order").val();
    let price = $("#price-order").val();
    let orderQty = $("#orderQty").val();
    let total = orderQty*price;

    netTotal(total);

    let item_qty = $("#qty-order").val();
    let qty = item_qty - orderQty;
    let index = item_db.findIndex(item => item.item_code === itemCode);
    let item_obj = new ItemModel(itemCode, description, price, qty);
    item_db[index] = item_obj;
    loadItemData();

    let order_obj = new OrderModel(itemCode, description, price, orderQty, total);
    order_db.push(order_obj);
    clear();
    loadOrderData();
});
$("#selectCusID").eq(0).on("click", () => {
    $("#selectCusID").empty();
    var selectElement = $("#selectCusID");
    var option = $("<option>")
        .text("customer id")
    selectElement.append(option);
    for (var i = 0; i < customer_db.length; i++) {
        var option = $("<option>")
            .val(customer_db[i].customer_id)
            .text(customer_db[i].customer_id);
        selectElement.append(option);
    }
});
$("#selectCusID").on("change", function() {
    var selectedValue = $(this).val();
    let index = customer_db.findIndex(item => item.customer_id === selectedValue);
    $("#name-order").val(customer_db[index].name)
});
$("#itemCode").on("click", () => {
    $("#itemCode").empty();
    var selectElement = $("#itemCode");
    var option = $("<option>")
        .text("Item Code")
    selectElement.append(option);
    for (var i = 0; i < item_db.length; i++) {
        var option = $("<option>")
            .val(item_db[i].item_code)
            .text(item_db[i].item_code);
        selectElement.append(option);
    }
});
$("#itemCode").on("change", function() {
    var selectedValue = $(this).val();
    $("#item-Code").val(selectedValue)
    let index = item_db.findIndex(item => item.item_code === selectedValue);
    $("#description-order").val(item_db[index].description)
    $("#price-order").val(item_db[index].price)
    $("#qty-order").val(item_db[index].item_qty)

});

const loadItemData = () => {
    $('#item_table-body').empty();
    item_db.map((item, index) => {
        let record = `<tr><td class="item_code">${item.item_code}</td><td class="description">${item.description}</td><td class="price">${item.price}</td><td class="item_qty">${item.item_qty}</td></tr>`;
        $("#item_table-body").append(record);
    });
};
$("#place-order>button[type='button']").eq(0).on("click", () => {
    clear();
    $("#name-order").val("");
    let netTotal = parseFloat($("#orderId").val());
    let newTotal = (netTotal+1);
    $("#orderId").val(newTotal);
    $("#total").val(0);
    $("#order-table-body").empty();
});