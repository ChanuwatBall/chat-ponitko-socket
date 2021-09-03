var WebSocketServer = require('websocket').server;
var http = require('http');
//var connections = require("./utils/connection-manager");


//just only test :
// var xx = require("./utils/test");
//Protocol connections = {};
//connections[key]; // get
//connections[key] = value; // put
//delete connection[key]; // delete


var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    //response.writeHead(404);
    response.write('hello');
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});


/*
  lcz: filter url
 */
function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

//setInterval(function() { console.log('timer: ', connections.me); }, 1000);
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    var user
//    console.log(connections.me);
//    connections.put("1", connection);
//    console.log(connections.me);
 
    console.log((new Date()) + ' Connection accepted.');

    connection.on('joined' ,user => {
        //user = username
        console.log('user '+user+' joined')
    })

    connection.on('message',message => {
        let messageOBJ = message.utf8Data

        console.log('Received Message: ' +  JSON.parse(messageOBJ)  );
        if (message.type === 'utf8') {
            console.log('Received Message: ' + messageOBJ);
            connection.sendUTF(messageOBJ);
        }
        // else if (message.type === 'binary') {
        //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        //     connection.sendBytes(message.binaryData);
        // }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});