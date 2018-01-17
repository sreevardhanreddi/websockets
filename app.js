var express = require('express');
var socketIO = require('socket.io');
var app = express();
var http = require('http');
var path = require('path');
var server = http.createServer(app);
var io = socketIO(server);
var rpio = require('rpio');
var sensor = require('node-dht-sensor');


rpio.open(7,rpio.OUTPUT,rpio.LOW);
rpio.open(11,rpio.OUTPUT,rpio.LOW);

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/index.html'));
});
 
io.on('connection',function(socket){
  console.log("new user connected");
  
  
  socket.on('oneON',function(){
  	console.log("device one ON");
	rpio.write(7,rpio.HIGH);


  })
  socket.on('oneOFF',function(){
  	console.log("device one OFF");
	rpio.write(7,rpio.LOW);


  })
  socket.on('twoON',function(){
  	console.log("device two ON");
	rpio.write(11,rpio.HIGH);


  })
  socket.on('twoOFF',function(){
  	console.log("device two OFF");
	rpio.write(11,rpio.LOW);


  })

 setInterval(function loop()
{ 
	var temp=0 ,hum=0;


 sensor.read(11, 26, function(err, temperature, humidity) {
    if (!err) {
	temp = temperature.toFixed(1);
	hum = humidity.toFixed(1);
        console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
            'humidity: ' + humidity.toFixed(1) + '%'
        );
	socket.emit('SensorTemp',temp);
	socket.emit('SensorHum',hum);
    }
});
//  socket.emit('SensorTemp',temp);
 // console.log(temp,hum);
 // socket.emit('SensorHum',hum);
},1000);


  socket.on('disconnect',function(){
    console.log("user disconnected");
  })
});


server.listen(3000,function(){
  console.log("server up at 3000")
});
