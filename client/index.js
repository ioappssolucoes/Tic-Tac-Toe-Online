import React from 'react';
import ReactDOM from 'react-dom';
import ClientWS from './ClientWebSocket';
import Login from './Login';

/*
 * BEGIN functions
 */

/*
	Handle Server messages.
	
	Message Types:
	wait = Waiting a player for start a match.
*/
function onServerMessage(msg) {	
	if(msg.type === 'wait') {
		this.setState({status: 'waiting'});
	} else if(msg.type === '') {
		
	}
}

// Handle the Login's onClick event.
function loginClickHandle(nickname) {
	// Start websocket
    this.clientWebSocket = new ClientWS('ws://localhost:8080');
    
    // Set the listeners
    this.clientWebSocket.on('open', () => {
    	// Set isConnected true.
        this.setState({isConnected: true});
        // Send Login Package.
        this.clientWebSocket.send({type: 'login', content: nickname});
    });
    
    this.clientWebSocket.on('message', (msg) => {
        this.onServerMessage(msg);
    });
    
    this.clientWebSocket.on('close', () => {
    	// Set isConnected false.
    	this.setState({isConnected: false});
    });
    
    this.clientWebSocket.on('error', (err) => {
        console.log('Error to established connection.');
    });
}
/*
 * END Functions.
 */

class TicTacToe extends React.Component {
    constructor(props) {
    	// Calls super
        super(props);
        // Set default state.
        this.state = {
        	isConnected: false,
        	status: 'login'
        };        
        // Binds
        this.onServerMessage = onServerMessage.bind(this);
        this.loginClickHandle = loginClickHandle.bind(this);
        // Binds
    }

    render() {
    	const getCurrentPage = () => {
    		if(this.state.status === 'waiting') {
    			return(
    				<p>Is connected</p>
    			);
    		} else if(this.state.status === 'login') {
    			return(
					<Login onClick={(v) => this.loginClickHandle(v)} />
    			);
    		}
    	}
        return(
            <div>
                {getCurrentPage()}
            </div>
        );
    }
}

ReactDOM.render(<TicTacToe />, document.getElementById('root'));