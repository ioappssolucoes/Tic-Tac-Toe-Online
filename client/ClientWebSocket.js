class ClientWebSocket {
    constructor(ws = 'ws://localhost:8080') {
        // Start connection.
        this.ws = new WebSocket(ws);
        // State isConnected?
        this.isConnected = false;
        // Listeners
        this.onOpenListener = () => {};
        this.onMessageListener = (msg) => {};
        this.onCloseListener = () => {};
        this.onErrorListener = (err) => {};

        // Set listeners
        this.ws.onopen = () => {
            this.isConnected = true;
            this.onOpenListener();
        };
        this.ws.onclose = () => {
            this.isConnected = false;
            this.onCloseListener();
        };
        this.ws.onmessage = (msg) => {  			
            this.onMessageListener(JSON.parse(msg.data));
        };
        this.ws.onerror = (err) => {
            this.onErrorListener(err);
        };
    }

    // Set callbacks
    on(event, callback) {
        if(event == 'open')
            this.onOpenListener = callback;
        else if(event == 'message')
            this.onMessageListener = callback;
        else if(event == 'close')
            this.onCloseListener = callback;
        else if(event == 'error')
            this.onErrorListener = callback;
    }

    // Send a message to teh server.
    send(msg) {
        if(this.isConnected)
            this.ws.send(JSON.stringify(msg));
    }

    // Close teh connection.
    closeConnection() {
        if(this.isConnected)
            this.ws.close();
    }
}

export default ClientWebSocket;