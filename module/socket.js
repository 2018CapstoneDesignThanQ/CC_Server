const SocketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SocketIO(server, {path: '/socket.io'});
    app.set('io', io);
    const room = io.of('/room');

    room.on('connection', (socket) => {
        console.log('class namespace connection');
        const req = socket.request;
        const {headers: {referer}} = req;
        const roomId = referer.split('/')[referer.split('/').length - 1].replace(/\?.+/, '');
        socket.join(roomId);
        socket.on('disconnect', () => {
            console.log('class namespace disconnection');
            socket.leave(roomId);
        });
    });
};