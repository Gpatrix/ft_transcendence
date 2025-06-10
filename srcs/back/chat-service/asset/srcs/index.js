"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const prisma_client_1 = require("../prisma/prisma_client");
const axios_1 = __importDefault(require("axios"));
const prisma = new prisma_client_1.PrismaClient();
const server = (0, fastify_1.default)();
server.register(cookie_1.default);
server.register(websocket_1.default);
server.register(chat_api);
server.addHook('preValidation', (request, reply, done) => {
    const token = request.cookies.ft_transcendence_jw_token;
    try {
        if (!token || token === undefined)
            return (reply.status(403).send({ error: "403" }));
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET).data;
        const id = decoded.id;
        if (!id || id === undefined)
            return (reply.status(403).send({ error: "403" }));
        done();
    }
    catch (error) {
        return (reply.status(403).send({ error: "403" }));
    }
});
var activeConn = new Map();
function closing_conn(socket, token) {
    activeConn.delete(token.id);
    console.log(`TODO handle closed ${token.name} socket, remaining: ${activeConn.size}`);
}
async function is_blocked(by, target) {
    if (!process.env.API_CREDENTIAL)
        return ("0500");
    try {
        const response = await axios_1.default.post(`http://user-service:3000/api/user/isBlockedBy/${by}/${target}`, { credential: process.env.API_CREDENTIAL }, { headers: { 'Content-Type': 'application/json' } });
        return (String(response.data.value));
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response?.data.error !== undefined)
                return (error.response?.data.error);
        }
        return ("0500");
    }
}
async function CreateChannel(usersID, isGame) {
    if (usersID === undefined)
        return ("400");
    usersID.sort((a, b) => a - b);
    try {
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
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log(error.response?.data);
            if (error.response?.data.error !== undefined)
                return (error.response?.data.error);
        }
        console.log(error);
        return ("0503");
    }
}
async function findChannel(usersID) {
    try {
        usersID.sort((a, b) => a - b);
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
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log(error.response?.data);
            if (error.response?.data.error !== undefined)
                return (error.response?.data.error);
        }
        console.log(error);
        return ("0503");
    }
}
async function get_user_info(userId) {
    if (!process.env.API_CREDENTIAL)
        return ("0500");
    try {
        const response = await axios_1.default.post(`http://user-service:3000/api/user/lookup/${userId}`, { credential: process.env.API_CREDENTIAL }, { headers: { 'Content-Type': 'application/json' } });
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log(error.response?.data);
            if (error.response?.data.error !== undefined)
                return (error.response?.data.error);
        }
        console.log(error);
        return ("0503");
    }
}
async function handle_msg(payload, token, socket) {
    if (payload.msg === undefined)
        return (socket.send("{error: 400}"));
    let target_user = await get_user_info(payload.targetId);
    if (typeof target_user === 'string')
        return (socket.send(`{"error": ${target_user}}`));
    let isBlocked = await is_blocked(token.id, target_user.id);
    if (isBlocked !== 'false') {
        if (isBlocked === 'true')
            socket.send("3001");
        else
            socket.send(isBlocked);
        return;
    }
    let channel = await findChannel([token.id, target_user.id]);
    if (channel === null)
        channel = await CreateChannel([token.id, target_user.id], false);
    if (typeof channel === 'string')
        return (socket.send(channel));
    try {
        const new_msg = await prisma.message.create({
            data: {
                channelId: channel?.id,
                senderId: token.id,
                content: payload.msg
            },
            select: {
                channelId: true,
                senderId: true,
                content: true,
                sentAt: true,
            },
        });
        new_msg.isGame = false;
        const target_socket = activeConn.get(target_user.id);
        if (target_socket !== undefined)
            target_socket.send(JSON.stringify(new_msg));
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log(error.response?.data);
            if (error.response?.data.error !== undefined)
                return (error.response?.data.error);
        }
        console.log(error);
        return ("0503");
    }
}
async function findGameChannel(channelId) {
    try {
        const channel = await prisma.channel.findUnique({
            where: {
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
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log(error.response?.data);
            if (error.response?.data.error !== undefined)
                return (error.response?.data.error);
        }
        console.log(error);
        return ("0503");
    }
}
async function handle_game_msg(payload, token, socket) {
    const channelId = Number(payload.targetId);
    if (payload.msg === undefined || isNaN(channelId))
        return (socket.send("{error: 400}"));
    const participants = await findGameChannel(channelId);
    if (typeof participants === 'string')
        return (socket.send(participants));
    if (!participants.some(p => p.userId === token.id))
        return (socket.send(`{"error": 401}`));
    try {
        const new_msg = await prisma.message.create({
            data: {
                channelId: channelId,
                senderId: token.id,
                content: payload.msg
            },
            select: {
                channelId: true,
                senderId: true,
                content: true,
                sentAt: true,
            },
        });
        new_msg.isGame = true;
        const to_send = JSON.stringify(new_msg);
        console.log(to_send);
        let target_socket;
        for (let p of participants) {
            if (p.userId === token.id)
                continue;
            target_socket = activeConn.get(p.userId);
            if (target_socket !== undefined)
                target_socket.send(to_send);
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log(error.response?.data);
            if (error.response?.data.error !== undefined)
                return (error.response?.data.error);
        }
        console.log(error);
        return ("0503");
    }
}
async function handle_refresh(payload, token, socket) {
    if (payload.skip === undefined || payload.take == undefined)
        return (socket.send(`{"error": 0400}`));
    if (payload.take < 1 || payload.take > 20)
        return (socket.send(`{"error": 3010}`));
    try {
        const target_info = await get_user_info(payload.targetId);
        if (typeof target_info === 'string')
            return (socket.send(`{"error": ${target_info}}`));
        let channel = await findChannel([token.id, target_info.id]);
        if (channel === null)
            channel = await CreateChannel([token.id, target_info.id], false);
        if (typeof channel === 'string')
            return (socket.send(channel));
        const requested_msg = await prisma.message.findMany({
            where: { channelId: channel.id },
            orderBy: { sentAt: 'desc' },
            skip: payload.skip,
            take: payload.take,
            select: {
                channelId: true,
                senderId: true,
                content: true,
                sentAt: true,
            },
        });
        socket.send(JSON.stringify(requested_msg));
    }
    catch (error) {
        return (socket.send(`{"error": 0500}`));
    }
}
function data_handler(RawData, socket, token) {
    console.log('Received:\n', RawData.toString());
    const payload = JSON.parse(RawData.toString('utf8'));
    if (payload.action === undefined || payload.targetId === undefined)
        return (socket.send('{error: 0400}'));
    if (payload.targetId === token.id)
        return socket.send('{error: 3002}');
    switch (payload.action) {
        case "msg":
            handle_msg(payload, token, socket);
            break;
        case "game_msg":
            handle_game_msg(payload, token, socket);
            break;
        case "refresh":
            handle_refresh(payload, token, socket);
            break;
        default:
            socket.send(`{"error": 0400}`);
            return;
    }
}
async function chat_api() {
    server.get('/api/chat/connect', { websocket: true }, (socket, request) => {
        try {
            const token = request.cookies.ft_transcendence_jw_token;
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET).data;
            activeConn.set(decodedToken.id, socket);
            socket.on('message', (RawData) => data_handler(RawData, socket, decodedToken));
            socket.on('close', () => closing_conn(socket, decodedToken));
        }
        catch (error) {
            console.log(error);
        }
    });
    server.post('/api/chat/newChannel', async (request, reply) => {
        const credential = request.body?.credential;
        if (!credential || credential != process.env.API_CREDENTIAL)
            reply.status(401).send({ error: "private_route" });
        let channel = await CreateChannel(request.body?.usersId, true);
        if (typeof channel === 'string')
            return (reply.status(400).send(channel));
        return (reply.status(200).send({ channelId: channel.id }));
    });
}
server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`ready`);
});
