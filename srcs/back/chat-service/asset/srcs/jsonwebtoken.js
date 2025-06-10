"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConnected = isConnected;
const jwt = require("jsonwebtoken");
function isConnected(request, reply, done) {
    const token = request.cookies.ft_transcendence_jw_token;
    if (!token)
        return (reply.status(401).send({ error: 1019 }));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.data?.id;
    if (!id)
        return (reply.status(401).send({ error: "1016" }));
    done();
}
module.exports = isConnected;
