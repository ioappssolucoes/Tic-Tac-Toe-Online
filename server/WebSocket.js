/**
* Credits: Marcus Vinicius Pitz and Matheus Henrique Pitz
* Copyright: 2018
*
* This implementation is originally from
* https://github.com/marcuspitz/websocket-simple-chat
* With some changes.
*
**/
module.exports =  function WebSocket (httpServer, c) {
	// Import
	const WebSocketServer = require('websocket').server;	
	
	// All clients are here.
	let connections = [];
	// Connection count, used to generate connectionID.
	let connCount = 0;
	// All configurations.
	let config = {
		testMode: false,		
		protocol: null
	};
	
	// Create a instance of WebSocket
	const socket = new WebSocketServer({
		httpServer: httpServer,
		autoAcceptConnections: false
	});
	
	//Listeners
	let onConnectListener = (connection) => {};
	let onMessageListener = (message, connectionID) => {};
	let onCloseConnectionListener = (connection) => {};
	let onRequestConnectionListener = (request) => {return true;};
	//Listeners
		
	
	// Constructor
	function initialize() {
		// Set config values.
		if(c.testMode != undefined)
			config.testMode = c.testMode;
		if(c.protocol != undefined)
			config.protocol = c.protocol;
	}
	
	// Call constructor
	initialize();
	
	// Function on, used to register events
	this.on = (type, listener) => {		
		type = type.toLowerCase();
		if (type === 'connect') {
			onConnectListener = listener;
		} else if (type === 'message') {
			onMessageListener = listener;
		} else if (type === 'disconnect') {
			onCloseConnectionListener = listener;
		} else if (type === 'request') {
            onRequestConnectionListener = listener;
        }
		return this;
	};
	
	// Return all clients connected.
	this.getConnections = () => connections;	
	
	// Send message to the connection
	this.send = (connectionID, message) => {
		connections[connectionID].sendUTF(JSON.stringify(message));
	}
	
	// Send message to all connections.
	this.sendBroadcastMessage = (message) => {
		for (c in connections) {
			this.send(connections[c].connectionID, message);			
		};
	}
	
	this.dropConnection = (connectionID) => {
		connections[connectionID].drop();
	};
	
	function getConnectionCount() {
		connCount++;
		return connCount;
	}
	
	function log(message) {
		if (config.testMode) {
			console.log((new Date()) + '::' + message);
		}
	}

	socket.on('request', (request) => {
		// Verify if can we accept that connection		
		if (!onRequestConnectionListener(request)) {
		  log('Connection from ' + request.origin + ' was rejected.');
		  // call reject to reject that connection.
		  request.reject();      
		  return;
		}    
		// Accept connection and get its connection.
		const connection = request.accept(config.protocol, request.origin);
		// Generate connectionID
		connection.connectionID = getConnectionCount();
		// Save connection.
		connections[connection.connectionID] = connection;
		// Call onConnectListener.
		onConnectListener(connection.connectionID);
		
		log('Connection from ' + request.remoteAddress + ' was accepted:' + connection.connectionID);
		
		// Set onMessageListener.
		connection.on('message', (message) => {			
			// Cconvert UTF8 string to JSON.
			let msg = JSON.parse(message.utf8Data);
			log('Received Message: ' + message.utf8Data + ', from: ' + connection.connectionID);
			// Call the event.
			onMessageListener(msg, connection.connectionID);			
		});
		
		connection.on('close', (reasonCode, description) => {
			log('Connection ' + connection.connectionID + ' was disconnected. Reason Code '+reasonCode);
			// Delete the connection
			delete connections[connection.connectionID];
			// Call the event
			onCloseConnectionListener(connection.connectionID);
		});
		
	});
}