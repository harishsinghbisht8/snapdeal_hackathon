(function (W, D) {

    var userName = localStorage.ttUserName ? localStorage.ttUserName : "";
    var level = null;
    var connectionCreated = false;
    var socket = null;
    var roomName = localStorage.ttRoomName ? localStorage.ttRoomName : "";

    var $partials = $(".page-partial");

    if(userName) {
        $("#pageMessage").html("Hi, " + userName);
        showPartial("roomPartial");
        connectSocket();
    }

    function connectSocket() {
        socket = io.connect("/?name=" + userName);

        socket.on("connect", function () {
            showPartial("roomPartial");
        });

        socket.on("gamerequest", function (data) {
            var $rooms = $("#rooms");
            var roomsHtml = "";
            var roomIdArray = Object.keys(data);

            if(roomIdArray.length) {
                $("#avlblRooms").removeClass("u-hide");

                for(var index in roomIdArray) {
                    roomsHtml += '<div class="room" data-key="' + data[roomIdArray[index]].gameid + '">' + data[roomIdArray[index]].name + '</div>';
                }

                $rooms.html(roomsHtml);
            } else {
                $("#avlblRooms").addClass("u-hide");
            }
        });

        socket.on("message", function (data) {
            console.log(data);
        });
    }

    function showPartial(partialId) {
        $partials.addClass("u-hide");
        $partials.filter("#"+partialId).removeClass("u-hide");
    }

    function paintGrids() {
        for(var index = 0; index < level; ++index) {
            
        }
    }

    $("#userSubmit").on("click", function (event) {
        userName = $("#userName").val();

        if(userName.length) {
            localStorage.ttUserName = userName;
            $("#pageMessage").html("Hi, " + userName);

            if(!socket) {
                connectSocket();
            }
        }
    });

    $("#avlblRooms").on("click", ".room", function() {
        var $room = $(this);
        socket.emit("acceptchallenge", $room.attr("data-key"));
    });



    $("#roomSubmit").on("click", function () {
        roomName = $("#roomName").val();
        if(socket && roomName) {
            localStorage.ttRoomName = roomName;
            socket.emit("creategameroom", roomName);

        }
    });


})(window, document);