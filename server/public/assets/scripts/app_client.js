/*  CLIENT SIDE     */

// event listeners
$(document).ready(function() {
    $("#search").submit(function(event){
        event.preventDefault();
        var values = {};

        $.each($(this).serializeArray(), function(i, field){
            values[field.name] = field.value;
        });

        findPerson(values);
    });
    $("#getData").on("click", getPeopleList);
    $("#postData").on("click", addPerson)

    // populate list
    getPeopleList();
});

// ajax requests

function findPerson(searchQuery) {
    $.ajax({
        type: "POST",
        url: "/people/find",
        data: searchQuery,
        beforeSend: function(data) {
            console.log("Search for: ", searchQuery);
        },
        success: function(data) {
            refreshList(data);
        }
    })
}

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

function refreshList(data) {
    $("#peopleContainer").empty();

    for(var i = 0; i < data.length; i++){
        var el = "<div class='well col-md-3'>" +
            "<p>" + data[i].name + "</p>" +
            "<p>" + data[i].spirit_animal + "</p>" +
            "<p>" + data[i].city + "</p>" +
            "<button class='delete btn btn-danger' data-id='" +
            data[i].id + "'>Delete</button>" +
            "</div>";

        $("#peopleContainer").append(el);
    }
}