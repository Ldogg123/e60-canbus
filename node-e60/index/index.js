// Connect to backend
const socket = io.connect('127.0.0.1:3000');                       // Connect to local webserver on port 3000 (server.js)

document.addEventListener("DOMContentLoaded", onDomReadyHandler()) // When HTML page is fully loaded run the function.


function onDomReadyHandler(event) {
    socket.on('carMessage', (data) => {                            // When message is received from backend run
        var engTemp = document.getElementsByTagName('canvas')[0];  // Set engTemp = first gauge
        var revs = document.getElementsByTagName('canvas')[1];

        engTemp.setAttribute('data-value', data.engTemp)           // Set gauge value to engTemp
        revs.setAttribute('data-value', data.revs)

        console.log(data)                                          // Log data to browsers console
    })
}