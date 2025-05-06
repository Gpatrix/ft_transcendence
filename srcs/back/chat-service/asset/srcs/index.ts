import fastify from 'fastify';
import jwt from 'jsonwebtoken';
import cookiesPlugin from '@fastify/cookie'
import websocketPlugin, { WebsocketHandler } from '@fastify/websocket';
import WebSocket from 'ws';
import { PrismaClient } from "../prisma/prisma_client";
import axios, { AxiosError } from 'axios';
import { Param } from '@prisma/client/runtime/library';


const prisma = new PrismaClient();

const server = fastify();
server.register(cookiesPlugin);
server.register(websocketPlugin);
server.register(chat_api);

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
            return (reply.status(403).send({ error: "403" }));
         const decoded: tokenStruct = jwt.verify(token, process.env.JWT_SECRET as string).data;
         const id = decoded.id;
         if (!id || id === undefined)
            return (reply.status(403).send({ error: "403" }));
         done();
      }
      catch (error) {
         console.log(error);
         return (reply.status(403).send({ error: "403" }));
      }
})

var activeConn: Map<number, WebSocket> = new Map();

function closing_conn(socket: WebSocket, token: tokenStruct): void
{
   activeConn.delete(token.id);
   console.log(`TODO handle closed ${token.name} socket, remaining: ${activeConn.size}`);
}

async function is_blocked(by: number, target: number): Promise<string>
{
   if (!process.env.API_CREDENTIAL)
      return ("0500");

   try
   {
      const response = await axios.post(
         `http://user-service:3000/api/user/isBlockedBy/${by}/${target}`,
         {credential: process.env.API_CREDENTIAL}, 
         {headers: {'Content-Type': 'application/json'}}
      )
      return (String(response.data.value));
   }
   catch (error: AxiosError | unknown)
   {
      if (axios.isAxiosError(error))
      {
         if (error.response?.data.error !== undefined)
            return (error.response?.data.error);
      }
      return ("0500");
   }
}

interface t_channel
{
   id: number;
   isGame: boolean;
   createdAt: Date;
}

async function CreateChannel(usersID: number[], isGame: boolean): Promise<t_channel | string>
{
   usersID.sort((a, b) => a - b)

   try
   {
      const newChannel = await prisma.channel.create({
         data: {
            isGame: isGame,
            participants: {
               create: usersID.map((userId) => ({
                  userId: userId,
               })),
            },
         },
         include: {
            participants: true,
         },
      });
      
      return (newChannel);
   }
   catch (error)
   {
      if (axios.isAxiosError(error))
         {
            console.log(error.response?.data);
            if (error.response?.data.error !== undefined)
               return (error.response?.data.error);
         }
      return ("0503");
   }
}

async function findChannel(usersID: number[], isGame: boolean): Promise<t_channel | string | null>
{
   try
   {
      usersID.sort((a, b) => a - b)

      const existingChannel = await prisma.channel.findFirst({
         where: {
            isGame: isGame,
            participants: {
               some: {
                  userId: {
                     in: usersID,
                  },
               },
            },
         }, 
         include: {
            participants: true,
         },
      });

      return (existingChannel);
   }
   catch (error: AxiosError | unknown)
   {
      if (axios.isAxiosError(error))
      {
         console.log(error.response?.data);
         if (error.response?.data.error !== undefined)
            return (error.response?.data.error);
      }
      return ("0503");
   }
}

interface userInfo
{
   id: number;
   name: string;
   email: string;
   password: string;
   prof_picture: string | undefined;
   bio: string | null;
   lang: string | undefined;
   isAdmin: boolean;
}

async function get_user_info(username: string): Promise<userInfo | string>
{
   if (!process.env.API_CREDENTIAL)
      return ("0500");

   try
   {
      const response = await axios.post(
         `http://user-service:3000/api/user/lookup/name/${username}`,
         {credential: process.env.API_CREDENTIAL}, 
         {headers: {'Content-Type': 'application/json'}}
      )
      return (response.data as userInfo);
   }
   catch (error: AxiosError | unknown)
   {
      if (axios.isAxiosError(error))
      {
         console.log(error.response?.data);
         if (error.response?.data.error !== undefined)
            return (error.response?.data.error);
      }
      return ("0503");
   }
}

async function handle_msg(payload: payloadstruct, token: tokenStruct, socket: WebSocket)
{
   if (payload.msg === undefined)
   {
      socket.send("{error: 400}");
      return;
   }

   let target_user: userInfo | string = await get_user_info(payload.target);
   if (typeof target_user === 'string')
      return (socket.send(`{"error": ${target_user}}`))

   let isBlocked = await is_blocked(token.id, target_user.id);
   if (isBlocked !== 'false')
   {
      if (isBlocked === 'true')
         socket.send("3001");
      else
         socket.send(isBlocked);
      return;
   }

   let channel: t_channel | string | null = await findChannel([token.id, target_user.id], false);
   if (channel === null)
      channel = await CreateChannel([token.id, target_user.id], false);
   if (typeof channel === 'string')
      return (socket.send(channel));

   try
   {
      await prisma.message.create(
      {
         data: {
            channelId: channel?.id,
            senderId: token.id,
            content: payload.msg
         }
      });

      const target_socket: WebSocket | undefined = activeConn.get(target_user.id);
      if (target_socket !== undefined)
      {
         target_socket.send(
            `"origin": ${token.name}, "msg": ${payload.msg}`
         );
      }
   }
   catch (error)
   {
      if (axios.isAxiosError(error))
      {
         console.log(error.response?.data);
         if (error.response?.data.error !== undefined)
            return (error.response?.data.error);
      }
      return ("0503");
   }
}

async function handle_refresh(payload: payloadstruct, token: tokenStruct, socket: WebSocket)
{
   if (payload.skip === undefined || payload.take == undefined)
      return (socket.send(`{"error": 0400}`));

   if (payload.take < 1 || payload.take > 20)
      return (socket.send(`{"error": 3010}`));

   try
   {
      const target_info: userInfo | string = await get_user_info(payload.target);
      if (typeof target_info === 'string')
         return (socket.send(`{"error": ${target_info}}`));

      const channel: t_channel | string = await findOrCreateChannel(token.id, target_info.id);
      if (typeof channel === 'string')
         return (socket.send(`{"error": ${target_info}}`));

      const requested_msg = await prisma.message.findMany(
      {
         where: {channelId: channel.id},
         orderBy: {sentAt: 'desc'},
         skip: payload.skip,
         take: payload.take
      });
      
      socket.send(JSON.stringify(requested_msg));
   }
   catch (error)
   {
      return (socket.send(`{"error": 0500}`));
   }
}

function data_handler(
   RawData: WebSocket.RawData, socket: WebSocket, token: tokenStruct): void
{
   console.log('Received:\n', RawData.toString());
   const payload: payloadstruct = JSON.parse(RawData.toString('utf8'));
   if (payload.action === undefined || payload.target === undefined)
      return (socket.send('{error: 0400}'));

   if (payload.target === token.name)
      return socket.send('{error: 3002}');

   switch (payload.action)
   {
      case "msg":
         handle_msg(payload, token, socket);
         break;

      case "refresh":
         handle_refresh(payload, token, socket);
         break;

      default:
         socket.send(`{"error": 0400}`);
         return;
   }
}

interface newChannelParams
{
   userId: number[];
}

interface newChannelBody
{
    credential: string
}

async function chat_api()
{
   server.get('/api/chat/connect', {websocket: true}, (socket: WebSocket, request) => 
   {
      try
      {
         const token: string | undefined = request.cookies.ft_transcendence_jw_token
         const decodedToken: tokenStruct = jwt.verify(token as string, process.env.JWT_SECRET as string).data;

         activeConn.set(decodedToken.id, socket);

         socket.on('message', (RawData: WebSocket.RawData) =>
            data_handler(RawData, socket, decodedToken));

         socket.on('close', () => closing_conn(socket, decodedToken));
      }
      catch (error)
      {
         console.log(error);
      }
   });

   server.post<{ Params: newChannelParams, Body: newChannelBody}>('/api/chat/newChannel', async (request, reply) => {
      const credential = request.body?.credential;
      if (!credential || credential != process.env.API_CREDENTIAL)
         reply.status(401).send({ error: "private_route" });
   
      let channel: t_channel | string= await CreateChannel(request.params.userId, true);
      if (typeof channel === 'string')
         return (reply.status(400).send(channel));
      
      return (reply.status(200).send({channelId: channel.id}));
   })}

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) =>
{
   if (err) {
      console.error(err);
      process.exit(1);
   }
   console.log(`ready`);
})