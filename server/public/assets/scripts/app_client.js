/*  CLIENT SIDE     */

// event listeners
$(document).ready(function() {
    $("#getData").on("click", clickGetData);
    $("#postData").on("click", clickPostData);
});

// ajax requests
function clickGetData() {
    $.ajax(
        {
            type: "GET",
            url: "/data",
            success: function (data) {
                console.log(data);
            }
        }
    );
}

function clickPostData() {
    var values = {};
    $.each($("#inputForm").serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    $("#inputForm").find("input[type=text]").val("");

    $.ajax(
        {
            type: "POST",
            url: "/data",
            data: values,
            beforeSend: function() {
                console.log("DATA: ", values);
            },
            success: function(data) {
                console.log(data);
            }
        }
    );
}