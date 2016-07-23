$( document ).ready(function() {
    console.log('i am here')
  var socket = io.connect('/?name=mohit');
  socket.on('connect', function() {
    socket.emit('join', $('#chatroom').val());
  });
  socket.on('message', function (data) {
    var updatedLi = '<li><b>'+data.user+'</b> : '+data.message +'</li>'
    $(updatedLi).appendTo('#conv_list')
  });


  $('#post_message').on('click', function(){
    if($('#my_message').val() != "")
    {
      socket.emit('message', { message: $('#my_message').val(), user:$('#my_user').val()});
      var updatedLi = '<li><b>'+$('#my_user').val()+'</b> : '+$('#my_message').val() +'</li>'
      $(updatedLi).appendTo('#conv_list')
    }
  });
});


