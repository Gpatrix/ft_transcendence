import fastify from 'fastify'
import websocketPlugin from '@fastify/websocket'
import WebSocket from 'ws';
import { SocketAddress } from 'net';

const server = fastify();
server.register(websocketPlugin);
server.register(wstest);

interface structID 
{
    id: bigint;
}

async function wstest()
{
   server.get<{Params: structID}>('/:id', { websocket: true }, (socket: WebSocket, req) => {
    try {
         socket.on('message', (message: WebSocket.RawData) => {
            console.log('Received:', message.toString());
            socket.send(`WebSockets id ${req.params.id}`);
        });
      } catch (error)
      {
         console.log(error);
      }
   });
}

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) =>
{
   if (err) {
      console.error(err);
      process.exit(1);
   }
   console.log(`ready`);
})