const jwt = require("jsonwebtoken");

export function isConnected(request, reply, done) {
    const token = request.cookies.ft_transcendence_jw_token;
    if (!token)
        return (reply.status(401).send({ error: 1019 }));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.data?.id
    if (!id)
      return (reply.status(401).send({ error: "1016" }));
    const dfa = decoded.data?.dfa;
    if (!dfa)
        return (reply.status(403).send({ error: "1020" }));
    done();
}

module.exports = isConnected;

