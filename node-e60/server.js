const can = require('socketcan');                                               //CAN Module
const express = require('express');                                             //Webserver
const app = express();
const server = require('http').createServer(app);                               //Create Webserver
const io = require('socket.io')(server);                                        //Socket to frontend

const channel = can.createRawChannel("vcan0", true);                            //Select vcan0 interface, enable timestamps
channel.setRxFilters([{id:170,mask:170},{id:464,mask:464}])                     //Filter ARBIDs NOTE: IDs are in DECIMAL not HEX!

var carInfo = {};
carInfo.speed = 0;
carInfo.revs = 0;
carInfo.engTemp = 0;

app.use(express.static(__dirname + "/index"));                                   //Serve up html folder
app.use('/scripts', express.static(__dirname + '/node_modules/canvas-gauges/')) //Map node_modules/canvas-gauges folder to /scripts on the front end

io.on('connection', function(client) {
    console.log('Client Connected!')
})

setInterval(() => {
    io.emit('carMessage', carInfo)                                              //Send carInfo to frontend under the name carMessage
}, 100)

channel.addListener("onMessage", function(msg) {                                //When msg is received check ID and convert to usable data. (e.g. engine temp)
    switch(msg.id) {
        case 170:
            carInfo.revs = (msg.data.readIntLE(4, 2)) * 0.25                    //Read msg data (Signed Integer, Little Endian, start at byte 4, read for 2 bytes)
            break;

        case 464:
            carInfo.engTemp = (msg.data.readUIntLE(0, 1)) - 48
            break;
    }    

    console.log(carInfo)
})

channel.start() 

server.listen(3000)                                                             //Webserver listens on port 3000