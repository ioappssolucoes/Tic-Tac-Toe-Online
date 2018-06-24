module.exports = new function GameHandler () {
	// Requires
	const Player = require('./Player');
	const Match = require('./Match');
	
	// Variables
	let players = [];
	let playersWaiting = [];
	let ws;
	
	/*
		Set WebSocket to manage the connections.
	*/
	this.setWS = (webSocket) => ws = webSocket;
	
	/*
	 	When a player disconnect.
	*/
	this.disconnectPlayer = (connectionID) => {
		delete players[connectionID];
	}
	
	/*
	 	Receive the message from client and execute the action.
	 	
	 	Message Types:
	 	login = When a player logged in and is waiting a player to start a match
	*/
	this.executeAction = (connectionID, msg) => {		
		// If, these are undefined, do nothing.
		if(msg == undefined || msg.type == undefined || connectionID == undefined)
			return;
		
		if(msg.type === 'login') {
			// Execute Login.
			executeLogin(connectionID, msg);
		} else if(msg.type === '') {
			
		}
	}		
	
	function executeLogin(connectionID, msg) {		
		// Get nickname.
		let nickname = msg.content;
		// Is nickname undefined?		
		if(nickname == undefined || nickname.trim().length < 1) {	
			// Send a message with error
			ws.send(connectionID, {
				type: 'login-error',
				content: 'Login error. Name can\'t be empty.'
			});
			// Close immediately the connection.
			ws.dropConnection(connectionID);
			return;
		}
		// Remove empty spaces.
		nickname = nickname.trim();
		if(hasNickname(nickname)) {	
			// Send a message with error
			ws.send(connectionID, {
				type: 'login-error',
				content: 'Login error. Name already exists.'
			});
			// Close immediately the connection.
			ws.dropConnection(connectionID);
			return;
		}
		let player = new Player(connectionID, nickname);
		players[connectionID] = player;
		if(isSomeoneWaiting()) {
			
		} else {
			playersWaiting.push(connectionID);
			ws.send(connectionID, {type: 'wait'});			
		}
	}
	
	function hasNickname(nickname) {
		for(p in players) {			
			if(players[p].getNickname() == nickname)
				return true;
		}
		return false;
	}
	
	function isSomeoneWaiting() {
		return false;
		return playersWaiting.length > 0;
	}
};