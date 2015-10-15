var SerialPort = require("serialport").SerialPort;
var express = require('express');
var connect = require('connect');
var routes = require('routes');
var path = require('path');
var http = require('http');
var serialPort;
function createNewSerialConnection() {
	serialPort = new SerialPort("/dev/ttyACM0", {
	  baudrate: 9600
	});


serialPort.on("open", function (r) {
console.log(r);
  console.log('open');

        serialPort.on('data', function(data) {
                process.stdout.write(data.toString());
        });
});



serialPort.on("error", function () {
  console.log('error');
        createNewSerialConnection();

})

}

createNewSerialConnection();

var h= new HTTPServer();

function HTTPServer() {
  var self = this;
  this.http = express();
  this.http.configure(function(){
    self.http.use(express.compress());
    self.http.use(express.static(path.join(__dirname, 'html')));
    
    self.http.use(express.bodyParser());
    self.http.use(express.methodOverride());


  });
  
  this.http.configure('development', function(){
    self.http.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });
  
  this.http.configure('production', function(){
    self.http.use(express.errorHandler());
  });
  
  this.httpserver = http.createServer(this.http).listen(1337); 


  
  self.http.get("/remoteCtrl", function(req, res) {
  	var signal = req.param("signal");
		console.log(signal);
		serialPort.write(signal, function(err, results) {
			if (!results) {
				createNewSerialConnection();
			}
		});

		res.send({ status: "ok" });
  	
  });
  
}
