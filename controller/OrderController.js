import {OrderModel} from "../model/OrderModel.js";
import {order_db} from "../db/db.js";

document.addEventListener('DOMContentLoaded', function () {
    generateNextOrderId();
    $("#total").val(0);
});
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
function generateNextOrderId() {
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/pos_system_backend_war/order",
        async:true,
        success: function (data) {
            $("#orderId").val(data);
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
}
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

    let order_obj = new OrderModel(itemCode, description, price, orderQty, total);
    order_db.push(order_obj);
    clear();
    loadOrderData();
});



$("#selectCusID").eq(0).on("click", () => {
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/pos_system_backend_war/customer",
        async:true,
        success: function (customer) {
            var selectElement = $("#selectCusID");
            selectElement.empty();
            var option = $("<option>")
                .text("customer id")
            selectElement.append(option);
            customer.forEach(function (customer) {
                var option = $("<option>")
                    .val(customer.id)
                    .text(customer.id);
                selectElement.append(option);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
});

$("#selectCusID").on("change", function() {
    var selectedValue = $(this).val();

    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/pos_system_backend_war/customer",
        async:true,
        success: function (customer) {
            customer.forEach(function (customer) {

                if (selectedValue === customer.id){
                    $("#customer-id").val(customer.id)
                    $("#name-order").val(customer.name)
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
});

$("#itemCode").on("click", () => {
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/pos_system_backend_war/item",
        async:true,
        success: function (item) {
            var selectElement = $("#itemCode");
            selectElement.empty();
            var option = $("<option>")
                .text("customer id")
            selectElement.append(option);
            item.forEach(function (item) {
                var option = $("<option>")
                    .val(item.code)
                    .text(item.code);
                selectElement.append(option);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
});
$("#itemCode").on("change", function() {
    var selectedValue = $(this).val();

    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/pos_system_backend_war/item",
        async:true,
        success: function (item) {
            item.forEach(function (item) {

                if (selectedValue === item.code){
                    $("#item-Code").val(selectedValue)
                    $("#description-order").val(item.description)
                    $("#price-order").val(item.unitPrice)
                    $("#qty-order").val(item.qty)
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });

});

$(document).ready(function() {
    var orderId = $("#orderId").val();
    function getOrderDetailArray() {
        var orderDetailArray = [];

        $('#order-table-body tr').each(function() {
            var orderDetailDTO = {
                orderId:orderId,
                itemCode: $(this).find('td:eq(0)').text(),
                description: $(this).find('td:eq(1)').text(),
                unitPrice: parseFloat($(this).find('td:eq(2)').text()),
                qty: parseInt($(this).find('td:eq(3)').text()),
                total: parseFloat($(this).find('td:eq(4)').text())
            };

            orderDetailArray.push(orderDetailDTO);
        });

        return orderDetailArray;
    }

    $("#place-order>button[type='button']").eq(0).on("click", function() {
        var orderId = $("#orderId").val();
        var orderDate = Date.now();
        var customerId = $("#customer-id").val();
        var amount = $("#total").val();

        var orderDTO = {
            orderId: orderId,
            customerId: customerId,
            price:amount,
            data:orderDate
        };

        var customerDTO = {
            id: customerId,
        };
        var orderDetailArray = getOrderDetailArray();
        var postData = {
            orderDTO: orderDTO,
            orderDetailDTOList: orderDetailArray,
            customerDTO: customerDTO
        };
        console.log(orderDTO)
        console.log(orderDetailArray)
        console.log(customerDTO)
        $.ajax({
            url: "http://localhost:8080/pos_system_backend_war/order",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function() {
                Swal.fire(
                    'Success!',
                    'Order has been saved successfully!',
                    'success'
                );
                clear();
                $("#name-order").val("");
                let netTotal = parseFloat($("#orderId").val());
                let newTotal = (netTotal+1);
                $("#orderId").val(newTotal);
                $("#total").val(0);
                $("#customer-id").val("");
                $("#order-table-body").empty();
                generateNextOrderId();
            },
            error: function() {
                Swal.fire(
                    'Error!',
                    'Order has been saved unsuccessfully!',
                    'error'
                );
                $("#total").val(0);
            }
        });
    });
});