import {CustomerModel} from "../model/CustomerModel.js";
import {customer_db} from "../db/db.js";


var row_index = null;

const sriLankanMobileNumberRegex = /^(\+94|0)[1-9][0-9]{8}$/;
var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

document.addEventListener('DOMContentLoaded', function () {
    loadCustomerData();
});

$('#customer-search').on("keyup", function () {
    let value = $(this).val().toLowerCase();
    $("tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});
const loadCustomerData = () => {
    var tableBody = $('#customer-table-body');
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/pos_system_backend_war/customer",
        async:true,
        success: function (customers) {
            tableBody.empty();

            customers.forEach(function (customer) {
                var row = $('<tr>');

                row.append($('<td>').text(customer.id));
                row.append($('<td>').text(customer.name));
                row.append($('<td>').text(customer.address));
                row.append($('<td>').text(customer.email));
                row.append($('<td>').text(customer.contact));

                tableBody.append(row);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch customer data. Status code:");
        }
    });
};

$(document).ready(function () {
    $("#customer-table-body").on("click", "tr", function () {
        var customerId = $(this).find("td:eq(0)").text();
        var name = $(this).find("td:eq(1)").text();
        var address = $(this).find("td:eq(2)").text();
        var email = $(this).find("td:eq(3)").text();
        var phone = $(this).find("td:eq(4)").text();

        $("#customer_id").val(customerId);
        $("#name").val(name);
        $("#address").val(address);
        $("#email").val(email);
        $("#phone").val(phone);
    });
});

// SAVE CUSTOMER DATA
$(document).ready(function (){
    $("#customer-batons>button[type='button']").eq(0).click(function (){
        let customer_id = $("#customer_id").val();
        let name = $("#name").val();
        let address = $("#address").val();
        let email = $("#email").val();
        let phone = $("#phone").val();

        if(customer_id) {
            if(name) {
                if(address) {
                    let isValidEmail = pattern.test(email);
                    if (email && isValidEmail){
                        // if (email){
                        let isValid = sriLankanMobileNumberRegex.test(phone);
                        if(phone && isValid) {
                            $.ajax({
                                method:"POST",
                                contentType:"application/json",
                                url:"http://localhost:8080/pos_system_backend_war/customer",
                                async:true,
                                data:JSON.stringify({
                                    id:customer_id,
                                    name:name,
                                    address:address,
                                    email:email,
                                    contact:phone
                                }),
                                success: function (data) {
                                    Swal.fire(
                                        'Success!',
                                        'Customer has been saved successfully!',
                                        'success'
                                    );
                                    loadCustomerData();
                                    $("#customer-batons>button[type='reset']").click();
                                },
                                error: function (xhr, exception) {
                                    // alert("Error")
                                    Swal.fire(
                                        'Error!',
                                        'Customer has been saved unsuccessfully!',
                                        'error'
                                    );
                                }
                            })

                        } else {
                            toastr.error('Invalid Customer Mobile Number');
                        }
                    }else{
                        toastr.error('Invalid Customer Email');
                    }
                } else {
                    toastr.error('Invalid Customer Address');
                }
            } else {
                toastr.error('Invalid Customer Name');
            }
        } else {
            toastr.error('Invalid Customer Id');
        }



    })
})
$(document).ready(function (){
    $("#customer-batons>button[type='button']").eq(1).click(function (){
        let customer_id = $("#customer_id").val();
        let name = $("#name").val();
        let address = $("#address").val();
        let email = $("#email").val();
        let phone = $("#phone").val();
        $.ajax({
            method:"PUT",
            contentType:"application/json",
            url:"http://localhost:8080/pos_system_backend_war/customer",
            async:true,
            data:JSON.stringify({
                id:customer_id,
                name:name,
                address:address,
                email:email,
                contact:phone
            }),
            success: function (data) {
                Swal.fire(
                    'Success!',
                    'Customer has been updated successfully!',
                    'success'
                );
                loadCustomerData();
                $("#customer-batons>button[type='reset']").click();
            },
            error: function (xhr, exception) {
                Swal.fire(
                    'Error!',
                    'Customer has been updated unsuccessfully!',
                    'error'
                );
            }
        })
    })
})
$(document).ready(function (){
    $("#customer-batons>button[type='button']").eq(2).click(function (){
        let customer_id = $("#customer_id").val();
        $.ajax({
            method:"DELETE",
            contentType:"application/json",
            url:"http://localhost:8080/pos_system_backend_war/customer",
            async:true,
            data:JSON.stringify({
                id:customer_id
            }),
            success: function (data) {
                Swal.fire(
                    'Success!',
                    'Customer has been deleted successfully!',
                    'success'
                );
                loadCustomerData();
                $("#customer-batons>button[type='reset']").click();
            },
            error: function (xhr, exception) {
                Swal.fire(
                    'Error!',
                    'Customer has been deleted unsuccessfully!',
                    'error'
                );
            }
        })
    })
})
// $(document).ready(function () {
//     $("#customer-batons>button[type='button']").eq(3).click(function (){
//         loadCustomerData();
//         // var tableBody = $('#customer-table-body');
//         // $.ajax({
//         //     method: 'GET',
//         //     url: "http://localhost:8080/pos_system_backend_war/customer",
//         //     async:true,
//         //     success: function (customers) {
//         //         tableBody.empty();
//         //
//         //         customers.forEach(function (customer) {
//         //             var row = $('<tr>');
//         //
//         //             row.append($('<td>').text(customer.id));
//         //             row.append($('<td>').text(customer.name));
//         //             row.append($('<td>').text(customer.address));
//         //             row.append($('<td>').text(customer.email));
//         //             row.append($('<td>').text(customer.contact));
//         //
//         //             tableBody.append(row);
//         //         });
//         //     },
//         //     error: function (xhr, status, error) {
//         //         console.error("Failed to fetch customer data. Status code:");
//         //     }
//         // });
//     });
// });

