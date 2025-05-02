const jwt = require("jsonwebtoken");

export function isConnected(request: any, reply: any, done: any) {
        const token = request.cookies.ft_transcendence_jw_token;
        if (!token)
            return (reply.status(401).send({ error: "user_not_logged_in" }));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.data?.id
        if (!id)
          return (reply.status(401).send({ error: "invalid_token_provided" }));
        const dfa = decoded.data?.dfa;
        if (!dfa)
            return (reply.status(403).send({ error: "user_not_logged_in_with_2fa" }));
    done();
}

module.exports = isConnected;

