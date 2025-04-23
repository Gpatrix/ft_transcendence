import fastify from 'fastify';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import cookiesPlugin from '@fastify/cookie'


const server = fastify();
server.register(cookiesPlugin);
server.register(wstest);

const wss = new WebSocketServer({ noServer: true });

interface structTarget
{
    target: string;
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

async function wstest()
{
   server.get<{Params: structTarget}>('/api/chat/:target', function (request, reply)
   {
      console.log(`target: ${request.params.target}`);
      reply.status(200).send({ response: "good" });
      // socket.send(`WebSockets target ${req.params.target}`);

      // try
      // {
      //    socket.on('message', (message: WebSocket.RawData) => {
      //       console.log('Received:', message.toString());
      //       socket.send(`bonce ${message}`);
      //    });
      // }
      // catch (error)
      // {
      //    console.log(error);
      // }
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