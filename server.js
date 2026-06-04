const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const channels = {};

const defaultChannel = 'my-channel';

function sanitizeChannel(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '')
        .slice(0, 64);
}

io.on('connection', (socket) => {
    const rawChannel = socket.handshake.query.channel;
    const channel = sanitizeChannel(rawChannel) || defaultChannel;

    socket.join(channel);

    if (!channels[channel]) {
        channels[channel] = '';
    }

    socket.emit('sync', channels[channel]);

    socket.on('edit', (text) => {
        if (typeof text !== 'string') return;

        channels[channel] = text;
        socket.to(channel).emit('sync', text);
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected from channel: ${channel}`);
    });

    console.log(`Connected to channel: ${channel}`);
});

const PORT = process.env.PORT || 3712;
server.listen(PORT, () => {
    console.log(`Telegrapho running on port ${PORT}`);
});