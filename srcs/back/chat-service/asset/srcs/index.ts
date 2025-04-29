import fastify from 'fastify';
import jwt from 'jsonwebtoken';
import cookiesPlugin from '@fastify/cookie'
import websocketPlugin from '@fastify/websocket';
import WebSocket from 'ws';
import { PrismaClient } from "../prisma/prisma_client";
import crypto from 'crypto';
import { isConstructorDeclaration } from 'typescript';

const prisma = new PrismaClient();

const server = fastify();
server.register(cookiesPlugin);
server.register(websocketPlugin);
server.register(chatws);

interface payloadstruct
{
   action: string;
   target: string;
   skip?: number;
   take?: number;
   msg?: string;
}

interface tokenStruct
{
    id: number,
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

var activeConn: Map<string, WebSocket> = new Map();

function closing_conn(socket: WebSocket, token: tokenStruct): void
{
   activeConn.delete(token.name);
   console.log(`TODO handle closed ${token.name} socket, remaining: ${activeConn.size}`);
}

async function handle_msg(payload: payloadstruct, token: tokenStruct, socket: WebSocket)
{
   if (payload.msg === undefined)
   {
      socket.send("no-msg-rcs");
      return;
   }

   //TODO verif user existance and block
   try
   {
      const channel_hash: string = getPrivChannelHash(token.name, payload.target);
      
      await prisma.msg.create(
      {
         data: {
            userID: token.id,
            channel: channel_hash,
            text: payload.msg
         }
      });

      let target_socket = activeConn.get(payload.target);
      if (target_socket !== undefined)
      {
         target_socket.send(
            `"origin": ${token.name}, "msg": ${payload.msg}`
         );
      }
   }
   catch (error)
   {
      console.log(error);
   }
}

async function handle_refresh(payload: payloadstruct, token: tokenStruct, socket: WebSocket)
{
   //TODO verif user existance
   if (payload.skip === undefined || payload.take == undefined)
   {
      socket.send("wrong-payload");
      return;
   }

   if (payload.skip < 0 || payload.skip > 5000 || payload.take < 1 || payload.take > 20)
   {
      socket.send("too many msg requested");
      return;
   }

   const channel_hash: string = getPrivChannelHash(token.name, payload.target);

   const requested_msg = await prisma.msg.findMany(
   {
      where: {channel: channel_hash},
      orderBy: {createdAt: 'desc'},
      skip: payload.skip,
      take: payload.take
   });

   socket.send(JSON.stringify(requested_msg));
}

function data_handler(
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

      switch (payload.action)
      {
         case "msg":
            handle_msg(payload, token, socket);
            break;

         case "refresh":
            handle_refresh(payload, token, socket);

            break;

         default:
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

async function chatws()
{
   server.get('/api/chat/connect', {websocket: true}, (socket: WebSocket, request) => 
   {
      try
      {
         const token: string | undefined = request.cookies.ft_transcendence_jw_token
         const decodedToken: tokenStruct = jwt.verify(token as string, process.env.JWT_SECRET as string).data;

         activeConn.set(decodedToken.name, socket);

         socket.on('message', (RawData: WebSocket.RawData) =>
            data_handler(RawData, socket, decodedToken));

         socket.on('close', () => closing_conn(socket, decodedToken));
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