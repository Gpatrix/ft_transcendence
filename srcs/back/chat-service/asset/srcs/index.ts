import fastify from 'fastify';
import jwt from 'jsonwebtoken';
import cookiesPlugin from '@fastify/cookie'
import websocketPlugin from '@fastify/websocket';
import WebSocket from 'ws';


const server = fastify();
server.register(cookiesPlugin);
server.register(websocketPlugin);
server.register(wstest);

interface structTarget
{
    target: string;
}

interface tokenStruct
{
    id: bigint,
    email: string,
    name: string,
    isAdmin: boolean
}

server.addHook('preValidation'
   , (request, reply, done) => {
      
      const token = request.cookies.ft_transcendence_jw_token
      try
      {
         if (!token || token === undefined)
            return (reply.status(401).send({ error: "user_not_logged_in" }));
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         const id = decoded.data?.id;
         if (!id || id === undefined)
            return (reply.status(401).send({ error: "invalid_token_provided" }));
         done();
      }
      catch (error) {
         console.log(error);
         return (reply.status(401).send({ error: "invalid_token_provided" }));
      }
})

var activeConn: Map<bigint, WebSocket> = new Map();
var nbConn: bigint = BigInt(0);

async function wstest()
{
   server.get<{Params: structTarget}>('/api/chat/:target', {websocket: true}, (socket: WebSocket, request) => 
   {
      try
      {
         activeConn.set(nbConn, socket);
         nbConn++;
         const token = request.cookies.ft_transcendence_jw_token
         const decodedToken: tokenStruct = jwt.verify(token, process.env.JWT_SECRET).data;
         // console.log(
         //    `\ttarget: ${request.params.target}
         //    id: ${decodedToken.id}
         //    name: ${decodedToken.name}`);

        
         socket.on('message', (message: WebSocket.RawData) =>
         {
            console.log('Received:', message.toString());
            activeConn.forEach((target: WebSocket, id: BigInt) =>
            {
               target.send(`rcs: ${message}`);
            })
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