const http = require('http');
const fs = require('fs');
const path = require('path');
const ws = require('./server/WebSocket');


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

// Set the listeners
webSocketInstance.on('connect', (client) => {
    console.log('New connection, ID: '+client.clientID);
});

webSocketInstance.on('message', (type, message, client) => {
    console.log('Received a the message '+message+' from '+client.clientID);
    webSocketInstance.send(client, {message: 'You are client '+client.clientID});
});

webSocketInstance.on('disconnect', (client) => {
    console.log('Connection '+client.clientID+' disconnected');
});

webSocketInstance.on('request', (request) => {
    console.log('Received a request to connect '+request);
    return true;
});