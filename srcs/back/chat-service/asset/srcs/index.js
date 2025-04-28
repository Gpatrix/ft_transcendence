"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const server = (0, fastify_1.default)();
server.register(cookie_1.default);
server.register(websocket_1.default);
server.register(wstest);
server.addHook('preValidation', (request, reply, done) => {
    const token = request.cookies.ft_transcendence_jw_token;
    try {
        if (!token || token === undefined)
            return (reply.status(401).send({ error: "user_not_logged_in" }));
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const id = decoded.data?.id;
        if (!id || id === undefined)
            return (reply.status(401).send({ error: "invalid_token_provided" }));
        done();
    }
    catch (error) {
        console.log(error);
        return (reply.status(401).send({ error: "invalid_token_provided" }));
    }
});
var activeConn = new Map();
function closing_conn(socket, token, target) {
    const index = activeConn.get(target)?.indexOf(socket);
    if (index !== undefined)
        activeConn.get(target)?.splice(index, 1);
    console.log(`closing ${token.name} socket`);
    console.log(`array size: ${activeConn.get(target)?.length}`);
}
async function wstest() {
    server.get('/api/chat/:target', { websocket: true }, (socket, request) => {
        try {
            const token = request.cookies.ft_transcendence_jw_token;
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET).data;
            if (!activeConn.has(request.params.target))
                activeConn.set(request.params.target, [socket]);
            else
                activeConn.get(request.params.target)?.push(socket);
            socket.on('message', (message) => {
                console.log('Received:', message.toString());
                activeConn.get(request.params.target)?.forEach((target) => {
                    if (socket === target)
                        return;
                    target.send(`rsc ${decodedToken.name} : ${message}`);
                });
            });
            socket.on('close', () => closing_conn(socket, decodedToken, request.params.target));
        }
        catch (error) {
            console.log(error);
        }
    });
}
server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`ready`);
});
