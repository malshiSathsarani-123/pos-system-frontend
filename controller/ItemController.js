import {ItemModel} from "../model/ItemModel.js";
import {customer_db, item_db} from "../db/db.js";

var row_index = null;

const loadItemData = () => {
    $('#item_table-body').empty();
    item_db.map((item, index) => {
        let record = `<tr><td class="item_code">${item.item_code}</td><td class="description">${item.description}</td><td class="price">${item.price}</td><td class="item_qty">${item.item_qty}</td></tr>`;
        $("#item_table-body").append(record);
    });
};

// submit
$("#item-batons>button[type='button']").eq(0).on("click", () => {
    let item_code = $("#item_code").val();
    let description = $("#description").val();
    let price = $("#price").val();
    let item_qty = $("#item_qty").val();

    let item_obj = new ItemModel(item_code, description, price, item_qty);

    item_db.push(item_obj);

    $("#item-batons>button[type='reset']").click();

    loadItemData();
});

// update
$("#item-batons>button[type='button']").eq(1).on("click", () => {

    let item_code = $("#item_code").val();
    let description = $("#description").val();
    let price = $("#price").val();
    let item_qty = $("#item_qty").val();

    let item_obj = new ItemModel(item_code, description, price, item_qty);

    let index = item_db.findIndex(item => item.item_code === item_code);

    item_db[index] = item_obj;

    $("#item-batons>button[type='reset']").click();

    loadItemData();
})

// delete
$("#item-batons>button[type='button']").eq(2).on("click", () => {
    let item_code = $("#item_code").val();

    let index = item_db.findIndex(item => item.item_code === item_code);

    item_db.splice(index, 1);

    $("#item-batons>button[type='reset']").click();

    loadItemData();
})

$("#item_table-body").on("click", "tr", function() {
    row_index = $(this).index();

    let item_code = $(this).find(".item_code").text();
    let description = $(this).find(".description").text();
    let price = $(this).find(".price").text();
    let item_qty = $(this).find(".item_qty").text();

    $("#item_code").val(item_code);
    $("#description").val(description);
    $("#price").val(price);
    $("#item_qty").val(item_qty);
});
$("#item-search").on('input',() =>{
    let search_item = $('#item-search').val();
    let result = item_db.filter((item) =>
        item.description.toLowerCase().startsWith(search_item.toLowerCase()) ||
        item.price.toLowerCase().startsWith(search_item.toLowerCase()) ||
        item.item_qty.toLowerCase().startsWith(search_item.toLowerCase())
    );
    $('#item_table-body').empty();
    result.map((item, index) => {
        let record = `<tr><td class="item_code">${item.item_code}</td><td class="description">${item.description}</td><td class="price">${item.price}</td><td class="item_qty">${item.item_qty}</td></tr>`;
        $("#item_table-body").append(record);
    });
});