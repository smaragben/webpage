var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serialport = require("serialport");

var mes = 0;
var dt = 0;
var portName = process.argv[2];
var myPort = new serialport(portName, {
    baudRate:9600,
    parser: new serialport.parsers.Readline('\r\n')
});


app.get('/', function(req, res){
    res.sendFile(__dirname + '/clientex.html');
});

myPort.on('data', (mydata)=>{
    console.log('SERIAL' + mydata);
});

io.sockets.on('connection', function(socket){
    
    myPort.on('open', ()=>{
        io.sockets.emit('openport', {message: 'Port is Open!'});
    });

    myPort.on('data', (mydata)=>{
        if(mes != mydata){
            dt = Number(mydata);
            io.sockets.emit('datastreamMES', {message: 'SERIAL' + mydata}, dt);
            mes = mydata;
        }
    });
  
    io.sockets.emit('welcome', { message: 'Welcome!'});
    socket.on('disconnect', function(){
        console.log('disconnect');
    });
})

http.listen(4000, function(){
    console.log('listen on 4000');
})