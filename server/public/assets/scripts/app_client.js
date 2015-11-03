/*  CLIENT SIDE     */

// event listeners
$(document).ready(function() {
    $("#getData").on("click", getPeopleList);
    $("#postData").on("click", addPerson);
});

// ajax requests
function getPeopleList() {
    $.ajax(
        {
            type: "GET",
            url: "/people/",
            success: function (data) {
                refreshList(data);
            }
        }
    );
}

function addPerson() {
    var values = {};
    $.each($("#inputForm").serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    $("#inputForm").find("input[type=text]").val("");

    $.ajax(
        {
            type: "POST",
            url: "/people/add",
            data: values,
            beforeSend: function() {
                console.log("DATA: ", values);
            },
            success: function(data) {
                if(data) {
                    // refresh our list
                    getPeopleList();
                } else {
                    console.log("ERROR adding people on server", data);
                }
            }
        }
    );
}

function refreshList(peopleArray) {
    $("#peopleList p").remove();

    for(var i = 0; i < peopleArray.length; i++) {
        var person = peopleArray[i];
        $("#peopleList").append('<p>' + person.name + '</p>');
    }
}