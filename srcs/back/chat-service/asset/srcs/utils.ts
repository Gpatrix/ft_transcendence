import { PrismaClient } from "@prisma/client";
import axios, { AxiosError } from 'axios';

const prisma = new PrismaClient();

export interface t_channel
{
   id: number;
   isGame: boolean;
   createdAt: Date;
}

export interface t_userInfo
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

export interface t_game_participants
{
   channelId: number;
   userId: number;
}

export interface t_message
{
   isGame?: boolean;
   content: string;
   channelId: number;
   senderId: number;
   sentAt: Date;
}

function trad_prisma_error(error: any): string
{
   if (axios.isAxiosError(error))
   {
         console.log(error.response?.data);
         return (error.response?.data.code)
   }
   console.log(error);
   return ("0503");
}

export async function is_blocked(by: number, target: number): Promise<string>
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
      return (trad_prisma_error(error));
   }
}

export async function CreateChannel(usersID: number[], isGame: boolean): Promise<t_channel | string>
{
   if (usersID === undefined)
      return ("400");
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
      return (trad_prisma_error(error));
   }
}

export async function findChannel(usersID: number[]): Promise<t_channel | string | null>
{
   try
   {
      usersID.sort((a, b) => a - b)

      const existingChannel = await prisma.channel.findFirst({
         where: {
            isGame: false,
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
      return (trad_prisma_error(error));
   }
}

export async function get_user_info(userId: number): Promise<t_userInfo | string>
{
   console.log("test");
   if (!process.env.API_CREDENTIAL)
      return ("0500");

   try
   {
      const response = await axios.post(
         `http://user-service:3000/api/user/lookup/${userId}`,
         {credential: process.env.API_CREDENTIAL}, 
         {headers: {'Content-Type': 'application/json'}}
      )
      return (response.data as t_userInfo);
   }
   catch (error: AxiosError | unknown)
   {
      return (trad_prisma_error(error));
   }
}

export async function findGameChannel(channelId: number): Promise<t_game_participants[] | string>
{
   try
   {
      const channel = await prisma.channel.findUnique({
         where:{
            id: channelId,
            isGame: true
         },
         include: {
            participants: true,
         },
      });
      
      if (channel?.participants)
         return (channel.participants);
      return ([]);
   }
   catch (error: AxiosError | unknown)
   {
     return (trad_prisma_error(error));
   }
}

export async function create_msg(channelId: number, senderId: number, content: string, isGame: boolean): Promise<t_message | string>
{
    try
    {
        const new_msg: t_message = await prisma.message.create(
            {
               data: {
                  channelId: channelId,
                  senderId: senderId,
                  content: content
               },
               select: {
                  channelId: true,
                  senderId: true,
                  content: true,
                  sentAt: true,
                },
            });
      
        new_msg.isGame = isGame;
        return (new_msg);
    }
    catch (error)
    {
      return (trad_prisma_error(error));
    }
}

export async function get_msg(channelId: number, toSkip: number, toTake: number): Promise<t_message[] | string> 
{
   try
   {
      const requested_msg: t_message[] = await prisma.message.findMany(
         {
            where: {channelId: channelId},
            orderBy: {sentAt: 'desc'},
            skip: toSkip,
            take: toTake,
            select: {
               channelId: true,
               senderId: true,
               content: true,
               sentAt: true,
             },
      });

      return (requested_msg);
   }
   catch (error)
   {
     return (trad_prisma_error(error));
   }
}