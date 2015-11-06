/*  CLIENT SIDE     */
// hi kris
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

    $("#addSomeone").submit(addSomeone);
    $("#peopleContainer").on('click', '.delete', deletePerson);

    // populate list
    getPeopleList();
});

// ajax requests
function findPerson(searchQuery) {
    $.ajax({
        type: "GET",
        url: "/people/find",
        data: searchQuery,
        beforeSend: function(data) {
            console.log("Search for: ", searchQuery);
        },
        success: function(data) {
            updateDOM(data);
        }
    })
}

function getPeopleList() {
    $.ajax(
        {
            type: "GET",
            url: "/people/",
            success: function (data) {
                updateDOM(data);
            }
        }
    );
}

function addSomeone() {
    event.preventDefault();
    var values = {};

    $.each($("#addSomeone").serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    $.ajax(
        {
            type: "POST",
            url: "/people/add",
            data: values,
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

function deletePerson(){
    var deletedId = {"id" : $(this).data("id")};

    console.log("Meaningful Log: ", deletedId);

    $.ajax({
        type: "DELETE",
        url: "/people/remove",
        data: deletedId,
        success: function(data){
            getPeopleList();
        }
    })
}

function updateDOM(data) {
    $("#peopleContainer").empty();
    $("#addSomeone").find("input[type=text]").val("");

    for(var i = 0; i < data.length; i++){
        var el = "<div class='well col-md-3'>" +
            "<p>" + data[i].name + "</p>" +
            "<p>" + data[i].location + "</p>" +
            "<button class='delete btn btn-danger' data-id='" +
            data[i].id + "'>Delete</button>" +
            "</div>";

        $("#peopleContainer").append(el);
    }
}