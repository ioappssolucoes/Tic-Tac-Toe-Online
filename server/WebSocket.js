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
	let clients = [];
	// Connection count, used to generate clientID.
	let connCount = 0;
	// All configurations.
	let config = {
		testMode: false,
		isJSON: false,
		protocol: null
	};
	
	// Create a instance of WebSocket
	const socket = new WebSocketServer({
		httpServer: httpServer,
		autoAcceptConnections: false
	});
	
	//Listeners
	let onConnectListener = (client) => {};
	let onMessageListener = (type, message, client) => {};
	let onCloseConnectionListener = (client) => {};
	let onRequestConnectionListener = (request) => {return true;};
	//Listeners
		
	
	// Constructor
	function initialize() {
		// Set config values.
		if(c.testMode != undefined)
			config.testMode = c.testMode;
		if(c.isJSON != undefined)
			config.isJSON = c.isJSON;
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
	this.getClients = () => clients;	
	
	// Send message to the connection
	this.send = (client, message, type='utf8') => {
		if (type === 'utf8') {
			let msg = config.isJSON ? JSON.stringify(message) : message;
			log('Sending: ' + msg);
			client.sendUTF(msg);
		} else {
			client.sendBytes(message);
		}
	}
	
	// Send message to all connections.
	this.sendBroadcastMessage = (message, type='utf8') => {
		for (c in clients) {
			this.send(clients[c], message, type);			
		};
	}
	
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
		// Generate clientID.
		connection.clientID = getConnectionCount();
		// Save connection.
		clients[connection.clientID] = connection;
		// Call onConnectListener.
		onConnectListener(connection);
		
		log('Connection from ' + request.origin + ' was accepted:' + connection.clientID);
		
		// Set onMessageListener.
		connection.on('message', (message) => {
			// Verify the message type
			if (message.type === 'utf8') {
				// Verify if it need to convert the message.
				let msg = config.json ? JSON.parse(message.utf8Data) : message.utf8Data
				log('Received Message: ' + msg + ', from: ' + connection.clientID);
				// Call the event.
				onMessageListener(message.type, msg, connection);
			} else if (message.type === 'binary') {
				log('Received Binary Message of ' + message.binaryData.length + ' bytes');
				// Call the event.
				onMessageListener(message.type, message.binaryData, connection);
			}			
		});
		
		connection.on('close', (reasonCode, description) => {
			log('Connection ' + connection.clientID + ' was disconnected. Reason Code '+reasonCode);
			// Delete the connection
			delete clients[connection.clientID];
			// Call the event
			onCloseConnectionListener(connection);
		});
		
	});
}