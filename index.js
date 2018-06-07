var express = require('express'),
app 		= express(),
http 		= require('http').Server(app),
config		= require('./config/config'),
io 			= require('socket.io')(http);
mp3Duration = require('mp3-duration');
glob 		= require("glob");
path 		= "public/music/";

app.use(express.static(__dirname + '/public'));

fileName = "02 - Slipknot - People = Shit.mp3";
endTime = 0;
startDate = new Date();
startTime = 0;
clientCount = 0;

function changeSong(){
	//figure out the filename
	//play the file
	//set new interval for changing to the next song


  var getDirectories = function (src, callback) {
    glob(src + '/**/*', callback);
  };
  getDirectories(path, function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
    var files = [];
  	for (var i = 0; i < res.length; i++) {
      //Do something
      if (res[i].substr(res[i].length - 4) === ".mp3"){
        files.push(res[i]);
      }
  	}


    var file = files[Math.floor(Math.random() * files.length)];
    fileName = file.slice(7);
    io.sockets.emit('play', fileName, startTime);

    mp3Duration(file, function (err, result) {
      if (err) return console.log(err.message);
      endTime = result;
      startDate = new Date();
      setTimeout(changeSong, result*1000);
    });
    }
  });


}





io.on('connection', function(socket){
  clientCount++;
  console.log("clients: ", clientCount);
  var endDate = new Date();
  var difference = (endDate.getTime() - startDate.getTime())/1000;
	socket.emit('play', fileName, difference);
	//a connection estabilished on the pair chat page
  socket.on('requestPlayBack', function(){
    var endDate = new Date();
    var difference = (endDate.getTime() - startDate.getTime())/1000;
  	socket.emit('play', fileName, difference);
  });
	socket.on('disconnect', function(){
	  clientCount--;
	});
});




changeSong();


http.listen(config.port, function(){
  console.log(`Listening on port ${config.port}`);
});
