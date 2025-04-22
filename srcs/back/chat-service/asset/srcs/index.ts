import fastify from 'fastify';
import websocketPlugin from '@fastify/websocket';
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';

const server = fastify();
server.register(websocketPlugin);
server.register(wstest);

interface structID
{
    target: string;
    token: string;
}

server.addHook('preValidation'
   , (request, reply) => {
   const token = request.headers['jwt'];
      try
      {
         if (!token || token === undefined)
            return (reply.status(401).send({ error: "user_not_logged_in" }));
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         console.log("debug");
         const id = decoded.data?.id;
         if (!id || id === undefined)
            return (reply.status(401).send({ error: "invalid_token_provided" }));
      }
      catch (error) {
         console.log(error);
         return (reply.status(401).send({ error: "invalid_token_provided" }));
      }
})

async function wstest()
{
   server.get<{Params: structID}>('/api/chat/:target', { websocket: true }, (socket: WebSocket, req) => {
      socket.send(`WebSockets target ${req.params.target}`);

      try
      {
         socket.on('message', (message: WebSocket.RawData) => {
            console.log('Received:', message.toString());
            socket.send(`bonce ${message}`);
         });
      }
      catch (error)
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