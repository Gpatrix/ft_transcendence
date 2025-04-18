import fastify from 'fastify'
import websocketPlugin from '@fastify/websocket'
import WebSocket from 'ws';

const server = fastify();
server.register(websocketPlugin);
server.register(wstest);

async function wstest()
{
   server.get('/*', { websocket: true }, (socket: WebSocket, req) => {
      try {
         socket.on('message', (message: WebSocket.RawData) => {
            console.log('Received:', message.toString());
            socket.send('Hello Fastify WebSockets');
         });
      } catch (error) {
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