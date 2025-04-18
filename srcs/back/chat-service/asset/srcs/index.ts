import fastify from 'fastify'
import websocketPlugin from '@fastify/websocket'
import WebSocket from 'ws';
import type { RawData } from 'ws'; // <-- Import this from 'ws'

const server = fastify();
server.register(websocketPlugin);

interface IChatInfo {
    target?: bigint;
}

// server.get<{Querystring: IChatInfo,}>('/', async (request, reply) => {
//     let message: string;

//     if (request.query.target == undefined)
//         message = 'no room found';
//     else
//         message = `recv room ${request.query.target}`;
//     return {message};
// })


// WebSocket route
server.get('/', { websocket: true }, (socket: WebSocket, req) => {
    try {
        socket.on('message', (message: WebSocket.RawData) => {
            console.log('Received:', message.toString());
            socket.send('Hello Fastify WebSockets');
          });
    } catch (error) {
        console.log(error);
    }
   
  });


server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`ready`);
})