import React from 'react';
import ReactDOM from 'react-dom';
import ClientWS from './ClientWebSocket';

class TicTacToe extends React.Component {
    constructor(props) {
        super(props);
        // Start websocket
        this.clientWebSocket = new ClientWS('ws://localhost:8080');
        // Set the listeners
        this.clientWebSocket.on('open', () => {
            alert('Connection opened');
        });
        this.clientWebSocket.on('message', (msg) => {
            alert('Received a message from server '+msg.data);
        });
        this.clientWebSocket.on('close', () => {
            alert('Connection closed');
        });
        this.clientWebSocket.on('error', (err) => {
            alert('Error: ');
        });
    }

    render() {
        // Message Ref Handle
        const messageRefHandle = (e) => {
            this.messageRef = e;
        };
        // Sned Click Handle
        const sendClickHandle = () => {
            this.clientWebSocket.send(JSON.stringify({data: this.messageRef.value}));
            this.messageRef.value = '';
        };

        return(
            <div>
                <input ref={(e) => messageRefHandle(e)} type={'text'} />
                <button onClick={() => sendClickHandle()}> Send </button>
            </div>
        );
    }
}

ReactDOM.render(<TicTacToe />, document.getElementById('root'));