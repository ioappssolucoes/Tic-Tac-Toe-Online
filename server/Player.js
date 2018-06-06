module.exports = function Player(connectionID, nickname) {
	// Variables	
	let isPlaying = false;	
	
	this.getConnectionID = () => connectionID
	this.getNickname = () => nickname
}