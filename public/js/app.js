(function (W, D) {

    var userName = "";
    var level = null;
    var connectionCreated = false;
    var socket = null;

    var $partials = $(".page-partial");

    function showPartial(partialId) {
        $partials.addClass("u-hide");
        $partials.filter("#"+partialId).removeClass("u-hide");
    }

    $("#userSubmit").on("click", function (event) {
        userName = $("#userName").val();

        if(userName.length) {
            $("#pageMessage").html("Hi, " + userName);

            if(!socket) {
                socket = io();
            }
            showPartial("roomPartial");
        }
    });
})(window, document);