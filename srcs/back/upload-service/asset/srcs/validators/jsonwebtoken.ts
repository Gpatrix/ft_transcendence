import jwt from 'jsonwebtoken';

export function isConnected(request, reply, done) {
    try {
        const token = request.cookies?.ft_transcendence_jw_token;
        if (!token)
            return (reply.status(230).send({ error: 1019 }));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.data?.id
        if (!id)
        return (reply.status(230).send({ error: "1016" }));
        const dfa = decoded.data?.dfa;
        if (!dfa)
            return (reply.status(230).send({ error: "1020" }));
        done();
    } catch (error) {
        console.error('JWT verification failed:', error);
        return (reply.status(230).send({ error: "0500" }));
    }

}

