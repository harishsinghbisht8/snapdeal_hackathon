(function (W, D) {

    var userName = localStorage.ttUserName ? localStorage.ttUserName : "";

    var level = 3;
    var socket = null;
    var roomName = localStorage.ttRoomName ? localStorage.ttRoomName : "";

    var gridStatus = {
        currentMove: 1,
        x: 0,
        y: 0,
        matrix: [],
        moveCount: 1
    };

    var isUsersTurn = false;

    var $partials = $(".page-partial");

    if(userName) {
        $("#pageMessage").html("Hi, " + userName + "!");
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
            $("#gamePartial").removeClass("disabled");
        });

        socket.on("move", function(data) {
            gridStatus.matrix = data.matrix;
            paintGrids(gridStatus.matrix);

            if(data.result == "1") {
                if(gridStatus.currentMove == 1) {
                    $("#pageMessage").html("Hi, " + userName + "! Congratulations, You Won!!");
                } else {
                    $("#pageMessage").html("Hi, " + userName + "! You lost.");
                }
            } else if(data.result == "2") {
                if(gridStatus.currentMove == 2) {
                    $("#pageMessage").html("Hi, " + userName + "! Congratulations, You Won!!");
                } else {
                    $("#pageMessage").html("Hi, " + userName + "! You lost.");
                }
            } else if(data.result == "draw") {
                $("#pageMessage").html("Hi, " + userName + "! The game is drawn.");
            } else if(data.result == "progress") {
                $("#pageMessage").html("Hi, " + userName + "! Now its your turn.");
                isUsersTurn = true;
            }
        });
    }

    function showPartial(partialId) {
        $partials.addClass("u-hide");
        $partials.filter("#"+partialId).removeClass("u-hide");
    }

    function paintGrids(matrix) {
        var gridHtml = "";
        var isMatrix = !!matrix;

        for(var index = 0; index < level; ++index) {
            gridStatus.matrix[index] = [];
            gridHtml += '<div class="row">';
            for(var j=0; j<level; ++j) {
                if(isMatrix) {
                    var currentText = gridStatus.matrix[index][j];
                    currentText = currentText==0 ? "" : (currentText==1? "x" : "0");
                    gridHtml += '<div class="col" data-row="' + index +  '" data-col="' + j + '">' + currentText + '</div>';
                } else {
                    gridStatus.matrix[index][j] = 0;
                    gridHtml += '<div class="col" data-row="' + index +  '" data-col="' + j + '"></div>';
                }
            }
            gridHtml += "</div>";
        }

        $("#tttCntnr").html(gridHtml);

        showPartial("gamePartial");
    }

    $("#userSubmit").on("click", function (event) {
        userName = $("#userName").val();

        if(userName.length) {
            localStorage.ttUserName = userName;
            $("#pageMessage").html("Hi, " + userName + "!");

            if(!socket) {
                connectSocket();
            }
        }
    });

    $("#avlblRooms").on("click", ".room", function() {
        var $room = $(this);
        socket.emit("acceptchallenge", $room.attr("data-key"));
        paintGrids();
        gridStatus.currentMove = 2;
        gridStatus.moveCount = 2;
        $("#gamePartial").removeClass("disabled");
        $("#pageMessage").html("Hi, " + userName + "! You connected to the  game room. Wait till he makes his move.");
    });

    $("#roomSubmit").on("click", function () {
        roomName = $("#roomName").val();
        if(socket && roomName) {
            localStorage.ttRoomName = roomName;
            socket.emit("creategameroom", roomName);

            gridStatus.currentMove = 1;
            gridStatus.moveCount = 1;
            paintGrids();
            $("#pageMessage").html("Hi, " + userName + "! Please wait while another user connects to play with you.");
        }
    });

    $("#tttCntnr").on("click", function() {
        if(isUsersTurn && !$("#gamePartial").hasClass("disabled")) {
            var $cell = $(this);

            if(!$cell.hasClass("disabled")) {
                isUsersTurn = false;
                $cell.addClass("disabled");
                gridStatus.moveCount += 2;
                gridStatus.x = $cell.attr("data-row");
                gridStatus.y = $cell.attr("data-col");
                socket.emit("move", gridStatus);
            }
        }
    });

})(window, document);