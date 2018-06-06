const http = require('http');
const fs = require('fs');
const path = require('path');
const ws = require('./server/WebSocket');
const GameHandler = require('./server/GameHandler');


const getMimeType = (ext) => {
    if(ext == '.html')
        return 'text/html';
    else if(ext == '.js')
        return 'application/javascript';
    else if(ext == '.css')
        return 'text/css';
    else
        return 'text/html';
};

const httpServer = http.createServer((req, res) => {
    console.log('Making a request to url '+req.url);
    fs.readFile('.'+req.url, (err, data) => {
        if(err == undefined) {
            // Get the extension.
            let ext = path.extname(req.url);
            // Write head HTTP
            res.writeHeader(200, {'Content-Type': getMimeType(ext)});
            // End the request.
            res.end(data, 'utf8');
        } else {
            console.log('Error '+err);
            res.writeHeader(404);
            res.end();
        }
    });
}).listen(8080, () => {
    console.log('Server is listening on port 8080.');
});

// Create WebSocketServer.
const webSocketInstance = new ws(httpServer, {testMode: true, isJSON: true});
console.log('WebSocket started');
// Set WebSocket Instance.
GameHandler.setWS(webSocketInstance);

// Set the listeners
webSocketInstance.on('connect', (connectionID) => {
    console.log('New connection, ID: '+connectionID);
});

webSocketInstance.on('disconnect', (connectionID) => {
    console.log('The connection '+connectionID+' disconnected');
    GameHandler.disconnectPlayer(connectionID);
});

webSocketInstance.on('request', (request) => {	
    return true;
});

webSocketInstance.on('message', (message, connectionID) => {
	// Send to GameHandler the Client's message.	
    GameHandler.executeAction(connectionID, message);
});