const net = require('net');

function check(host, port) {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.on('connect', () => {
        console.log(`Connected to ${host}:${port}`);
        socket.destroy();
    });
    socket.on('timeout', () => {
        console.log(`Timeout connecting to ${host}:${port}`);
        socket.destroy();
    });
    socket.on('error', (err) => {
        console.log(`Error connecting to ${host}:${port}: ${err.message}`);
    });
    socket.connect(port, host);
}

console.log('Testing connectivity...');
check('localhost', 8080);
check('127.0.0.1', 8080);
check('::1', 8080);
