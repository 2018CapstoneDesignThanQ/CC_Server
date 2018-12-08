const SocketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SocketIO(server);
    app.set('io', io);

    const room = io.of('/room');
    let chat = "welcome to the my class";
    room.on('connection', (socket) => {
        socket.on('getClassID', (id) => {
            let class_id = id;
            // console.log(class_id);
            socket.join(class_id);
            // room.to(class_id).emit('question', chat);
        });
            socket.on('disconnect', () => {
                console.log('class namespace disconnection');
                // socket.leave(roomId);
            });
    });
};