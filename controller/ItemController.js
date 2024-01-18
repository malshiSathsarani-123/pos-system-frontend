import {ItemModel} from "../model/ItemModel.js";
import {customer_db, item_db} from "../db/db.js";

document.addEventListener('DOMContentLoaded', function () {
    loadItemData();
});

$('#item-search').on("keyup", function () {
    let value = $(this).val().toLowerCase();
    $("tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});
const loadItemData = () => {
    var tableBody = $('#item_table-body');
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/pos_system_backend_war/item",
        async:true,
        success: function (item) {
            tableBody.empty();

            item.forEach(function (item) {
                var row = $('<tr>');

                row.append($('<td>').text(item.code));
                row.append($('<td>').text(item.description));
                row.append($('<td>').text(item.qty));
                row.append($('<td>').text(item.unitPrice));

                tableBody.append(row);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
};

$(document).ready(function () {
    $("#item_table-body").on("click", "tr", function () {
        var code = $(this).find("td:eq(0)").text();
        var description = $(this).find("td:eq(1)").text();
        var qty = $(this).find("td:eq(2)").text();
        var price = $(this).find("td:eq(3)").text();


        $("#item_code").val(code);
        $("#description").val(description);
        $("#item_qty").val(qty);
        $("#price").val(price);
    });
});

// SAVE CUSTOMER DATA
$(document).ready(function (){
    $("#item-batons>button[type='button']").eq(0).click(function (){
        let item_Code = $("#item_code").val();
        let description = $("#description").val();
        let item_qty = $("#item_qty").val();
        let price = $("#price").val();

        if(item_Code) {
            if(description) {
                if(item_qty) {
                    if (price){
                            $.ajax({
                                method:"POST",
                                contentType:"application/json",
                                url:"http://localhost:8080/pos_system_backend_war/item",
                                async:true,
                                data:JSON.stringify({
                                    code:item_Code,
                                    description:description,
                                    qty:item_qty,
                                    unitPrice:price
                                }),
                                success: function (data) {
                                    Swal.fire(
                                        'Success!',
                                        'Item has been saved successfully!',
                                        'success'
                                    );
                                    loadItemData();
                                    $("#item-batons>button[type='reset']").click();
                                },
                                error: function (xhr, exception) {
                                    Swal.fire(
                                        'Error!',
                                        'Item has been saved unsuccessfully!',
                                        'error'
                                    );
                                }
                            })

                        } else {
                            toastr.error('Enter Qty');
                        }
                    }else{
                        toastr.error('Enter Unit Price');
                    }
                } else {
                    toastr.error('Enter Description');
                }
            } else {
                toastr.error('Enter Code');
            }
    })
})
$(document).ready(function (){
    $("#item-batons>button[type='button']").eq(1).click(function (){
        let item_Code = $("#item_code").val();
        let description = $("#description").val();
        let item_qty = $("#item_qty").val();
        let price = $("#price").val();
        $.ajax({
            method:"PUT",
            contentType:"application/json",
            url:"http://localhost:8080/pos_system_backend_war/item",
            async:true,
            data:JSON.stringify({
                code:item_Code,
                description:description,
                qty:item_qty,
                unitPrice:price
            }),
            success: function (data) {
                Swal.fire(
                    'Success!',
                    'Item has been updated successfully!',
                    'success'
                );
                loadItemData();
                $("#item-batons>button[type='reset']").click();
            },
            error: function (xhr, exception) {
                Swal.fire(
                    'Error!',
                    'Item has been updated unsuccessfully!',
                    'error'
                );
            }
        })
    })
})
$(document).ready(function (){
    $("#item-batons>button[type='button']").eq(2).click(function (){
        let item_code = $("#item_code").val();
        $.ajax({
            method:"DELETE",
            contentType:"application/json",
            url:"http://localhost:8080/pos_system_backend_war/item",
            async:true,
            data:JSON.stringify({
                code:item_code
            }),
            success: function (data) {
                Swal.fire(
                    'Success!',
                    'Item has been deleted successfully!',
                    'success'
                );
                loadItemData();
                $("#item-batons>button[type='reset']").click();
            },
            error: function (xhr, exception) {
                Swal.fire(
                    'Error!',
                    'Item has been deleted unsuccessfully!',
                    'error'
                );
            }
        })
    })
})