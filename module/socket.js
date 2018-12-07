const SocketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SocketIO(server);
    app.set('io', io);
    // console.log(io);
    // const chat = io.of('/chat');
    // const room = io.of('/room');
    // room.on('connection', (socket) => {
    //     console.log('he');
    //     // console.log(socket.request);
    //     // room.on();
    // });

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
    // chat.on('connection', (socket) => {
    //     console.log('class namespace connection');
    //     const req = socket.request;
    //
    //     const {headers: {referer}} = req;
    //     const roomId = referer.split('/')[referer.split('/').length - 1].replace(/\?.+/, '');
    //     socket.join(roomId);
    //     socket.on('disconnect', () => {
    //         console.log('class namespace disconnection');
    //         socket.leave(roomId);
    //     });
    // });
};