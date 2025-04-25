import fastify from 'fastify';
import jwt from 'jsonwebtoken';
import cookiesPlugin from '@fastify/cookie'
import websocketPlugin from '@fastify/websocket';
import WebSocket from 'ws';
import Prisma from "@prisma/client";
import crypto from 'crypto';
import { isConstructorDeclaration } from 'typescript';

const server = fastify();
server.register(cookiesPlugin);
server.register(websocketPlugin);
server.register(wstest);

interface payloadstruct
{
   action: string;
   target: string;
   msg?: string;
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
      
      const token: string | undefined = request.cookies.ft_transcendence_jw_token
      try
      {
         if (!token || token === undefined)
            return (reply.status(401).send({ error: "user_not_logged_in" }));
         const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
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

function closing_conn(socket: WebSocket, token: tokenStruct): void
{
   console.log(`TODO handle closing ${token.name} socket`);
}

function message_handler(
   RawData: WebSocket.RawData, socket: WebSocket, token: tokenStruct): void
{
   try
   {
      console.log('Received:\n', RawData.toString());
      const payload: payloadstruct = JSON.parse(RawData.toString('utf8'));
      if (payload.action === undefined || payload.target === undefined)
      {
         socket.send("wrong-payload");
         return;
      }
      if (payload.action == 'msg' && payload.msg === undefined)
      {
         socket.send("no-msg-rcs");
         return;
      }

      

   }
   catch (error)
   {
      console.log(error);
   }
}

function getPrivChannelHash(username: string, target_name: string): string
{
   const new_username = username.padEnd(20, ' ');
   const new_target_name = target_name.padEnd(20, ' ');

   let combinedString: string;
   if (username > target_name)
      combinedString = new_username + new_target_name;
   else
      combinedString = new_target_name + new_username;

   const hash = crypto.createHash('sha256');
   hash.update(combinedString);
   return (hash.digest('hex'));
}

async function wstest()
{
   server.get('/api/chat/connect', {websocket: true}, (socket: WebSocket, request) => 
   {
      try
      {
         const token: string | undefined = request.cookies.ft_transcendence_jw_token
         const decodedToken: tokenStruct = jwt.verify(token as string, process.env.JWT_SECRET as string).data;

         // TODO verifier si la target exist et si elle n'est pas blocker
         // const channel: string = get_unique_hash(decodedToken.name, request.params.target);

         // console.log(channel);
         socket.on('message', (RawData: WebSocket.RawData) =>
            message_handler(RawData, socket, decodedToken));

         // socket.on('close', () => closing_conn(socket, decodedToken));
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