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

var activeConn: Map<string, WebSocket[]> = new Map();

function closing_conn(socket: WebSocket, token: tokenStruct, target: string): void
{
   const index = activeConn.get(target)?.indexOf(socket);
   if (index !== undefined)
      activeConn.get(target)?.splice(index, 1);
   console.log(`closing ${token.name} socket`);
   console.log(`array size: ${activeConn.get(target)?.length}`);
}

async function wstest()
{
   server.get<{Params: structTarget}>('/api/chat/:target', {websocket: true}, (socket: WebSocket, request) => 
   {
      try
      {
         const token = request.cookies.ft_transcendence_jw_token
         const decodedToken: tokenStruct = jwt.verify(token, process.env.JWT_SECRET).data;
         if (!activeConn.has(request.params.target))
            activeConn.set(request.params.target, [socket]);
         else
            activeConn.get(request.params.target)?.push(socket);

         socket.on('message', (message: WebSocket.RawData) =>
         {
            console.log('Received:', message.toString());
            activeConn.get(request.params.target)?.forEach((target: WebSocket) =>
            {
               if (socket === target)
                  return;
               target.send(`rsc ${decodedToken.name} : ${message}`);
            })
         });

         socket.on('close', () => closing_conn(socket, decodedToken, request.params.target));
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