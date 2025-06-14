import fastify from 'fastify';
import { FastifyInstance } from "fastify";
import jwt, { JwtPayload } from 'jsonwebtoken';
import cookiesPlugin from '@fastify/cookie'
import websocketPlugin from '@fastify/websocket';
import WebSocket from 'ws';
import {metrics, chat_requests_total} from './metrics'

import * as Utils from './utils'
import { get } from 'http';

global.activeConn = new Map<number, i_user>();

interface payloadstruct
{
   action: string;
   targetId: number;
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

function sendError(code: string, socket: WebSocket): void
{
   socket.send(`{"error": ${code === undefined ? "0503" : code}}`);
}

interface i_user
{
   socket: WebSocket;
   timeout: NodeJS.Timeout | null;
}

const server = fastify();
server.register(cookiesPlugin);
server.register(websocketPlugin);
server.register(chat_api);
server.register(metrics);

server.addHook('onResponse', (req, res, done) =>
{
	chat_requests_total.inc({method: req.method});
	done();
});


function closing_conn(socket: WebSocket, token: tokenStruct): void
{
   activeConn.delete(token.id);
   console.log(`closing ${token.name} connection, remaining: ${activeConn.size}`);
}

async function handle_msg(payload: payloadstruct, token: tokenStruct, socket: WebSocket)
{
   if (payload.msg === undefined)
      return (sendError("0400", socket));

   let target_user: Utils.t_userInfo | string = await Utils.get_user_info(payload.targetId);
   if (typeof target_user !== 'object')
      return (sendError(target_user, socket));

   if (token.isAdmin === false)
   {
      let isBlocked = await Utils.is_blocked(token.id, target_user.id);
      if (isBlocked !== 'false')
         return (sendError(isBlocked, socket));
   }

   let channel: Utils.t_channel | string | null = await Utils.findChannel([token.id, target_user.id]);
   if (channel === null)
      channel = await Utils.CreateChannel([token.id, target_user.id], false);
   if (typeof channel !== 'object')
      return (sendError(channel, socket));

   const new_msg: Utils.t_message | string = await Utils.create_msg(channel.id, token.id, payload.msg, false);
   if(typeof new_msg !== 'object')
      return (sendError(new_msg, socket));

   const target_socket: WebSocket | undefined = activeConn.get(target_user.id)?.socket;
   if (target_socket !== undefined)
      target_socket.send(JSON.stringify(new_msg));
}

async function handle_game_msg(payload: payloadstruct, token: tokenStruct, socket: WebSocket)
{
   const channelId: number = Number(payload.targetId);
   if (payload.msg === undefined || isNaN(channelId))
      return (socket.send(`{"error": 0400}`));

   const participants: Utils.t_game_participants[] | string = await Utils.findGameChannel(channelId);
   if (typeof participants === 'string')
      return (sendError(participants, socket));

   if (!participants.some(p => p.userId === token.id))
      return (socket.send(`{"error": 0401}`));

   const new_msg: Utils.t_message | string = await Utils.create_msg(channelId, token.id, payload.msg, true);
   if(typeof new_msg === 'string')
      return (sendError(new_msg, socket));

   const to_send: string = JSON.stringify(new_msg);
   let target_socket: WebSocket | undefined;
   for (let p of participants)
   {
      if (p.userId === token.id)
         continue;

      target_socket = activeConn.get(p.userId)?.socket;
      if (target_socket !== undefined)
         target_socket.send(to_send);
   }
}

interface i_refresh
{
   friendId: number,
   skipped: number,
   messages: Utils.t_message[]
}

async function handle_refresh(payload: payloadstruct, token: tokenStruct, socket: WebSocket)
{
   if (payload.skip === undefined || payload.take == undefined)
      return (socket.send(`{"error": 0400}`));

   if (payload.take < 1 || payload.take > 20)
      return (socket.send(`{"error": 3010}`));

   try
   {
      const target_info: Utils.t_userInfo | string = await Utils.get_user_info(payload.targetId);
      if (typeof target_info !== 'object')
         return (sendError(target_info, socket));

      let channel: Utils.t_channel | string | null = await Utils.findChannel([token.id, target_info.id]);
      if (channel === null)
         channel = await Utils.CreateChannel([token.id, target_info.id], false);
      if (typeof channel !== 'object')
         return (sendError(channel, socket));

      const requested_msg: Utils.t_message[] | string = await Utils.get_msg(channel.id, payload.skip, payload.take);
      if(typeof requested_msg !== 'object')
         return (sendError(requested_msg, socket));
      const to_send: i_refresh = {
         friendId: payload.targetId,
         messages: requested_msg,
         skipped: payload.skip
      };
      socket.send(JSON.stringify(to_send));
   }
   catch (error)
   {
      return (socket.send(`{"error": "0500"}`));
   }
}

interface i_addFriend
{
   action: string,
   friendId: number,
}

async function handle_managementFriend(payload: payloadstruct, token: tokenStruct, socket: WebSocket)
{
   try
   {

      const to_send: i_addFriend = {
         action: payload.action,
         friendId: token.id,
      };
      let target_socket: WebSocket | undefined;

      target_socket = activeConn.get(payload.targetId)?.socket;
      if (target_socket !== undefined)
         target_socket.send(JSON.stringify(to_send));
   }
   catch (error)
   {
      return (socket.send(`{"error": "0500"}`));
   }
}

function data_handler(
   RawData: WebSocket.RawData, socket: WebSocket, token: tokenStruct): void
{
   chat_requests_total.inc({method: "WSS"});
   const payload: payloadstruct = JSON.parse(RawData.toString('utf8'));
   if (payload.action === undefined || payload.targetId === undefined)
      return (socket.send('{error: 0400}'));

   if (payload.targetId == token.id)
      return socket.send('{error: 3002}');

   switch (payload.action)
   {
      case "msg":
         handle_msg(payload, token, socket);
         break;
      
      case "game_msg":
         handle_game_msg(payload, token, socket);
         break;

      case "refresh":
         handle_refresh(payload, token, socket);
         break;

      case "deleteFriend":
         handle_managementFriend(payload, token, socket);
         break;

      case "acceptRequest":
         handle_managementFriend(payload, token, socket);
         break;

      default:
         socket.send(`{"error": 0400}`);
         return;
   }
}

interface newChannelBody
{
   credential: string;
   usersId: number[];
}

interface i_isconnected
{
    id?: number;
}

async function chat_api(fastify: FastifyInstance)
{
   fastify.addHook('preValidation'
   , (request, reply, done) => 
    {
      try
      {
         chat_requests_total.inc({method: request.method});
         const token: string | undefined = request.cookies.ft_transcendence_jw_token
         if (token === undefined)
            return (reply.status(230).send({ error: "0403" }));
         const decoded: tokenStruct = (jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload).data;
         const id = decoded.id;
         if (id === undefined)
            return (reply.status(230).send({ error: "1016" }));
         done();
      }
      catch (error) {
        return (reply.status(230).send({ error: "0403" }));
      }
   })

   fastify.get('/api/chat/connect', {websocket: true}, (socket: WebSocket, request) => 
   {
      try
      {
         const token: string = request.cookies.ft_transcendence_jw_token as string
         const decodedToken: tokenStruct = (jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload).data;

         const user: i_user = {socket: socket, timeout: null}
         activeConn.set(decodedToken.id, user);

         socket.on('message', (RawData: WebSocket.RawData) => data_handler(RawData, socket, decodedToken));

         socket.on('close', () => closing_conn(socket, decodedToken));

      }
      catch (error)
      {
         console.log(error);
      }
   });

   fastify.get<{Params: i_isconnected}>('/api/chat/isconnected/:id', async (request, reply) => 
    {
        if (request.params.id === undefined)
            return reply.status(230).send({error: "0400"});
        return reply.status(200).send({value: activeConn.has(Number(request.params.id))});
    });

   fastify.post<{Body: newChannelBody}>('/api/chat/newChannel', async (request, reply) => {
      const credential = request.body?.credential;
      if (!credential || credential != process.env.API_CREDENTIAL)
         reply.status(230).send({ error: "private_route" });
      
      let channel: Utils.t_channel | string= await Utils.CreateChannel(request.body?.usersId, true);
      if (typeof channel === 'string')
         return (reply.status(230).send(channel));
      
      return (reply.status(200).send({channelId: channel.id}));
   })
}

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) =>
{
   if (err) {
      console.error(err);
      process.exit(1);
   }
   console.log(`ready`);
})