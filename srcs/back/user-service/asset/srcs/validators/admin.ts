import jwt from 'jsonwebtoken';

export function isAdmin(request, reply, done) {
    const token = request.cookies.ft_transcendence_jw_token;
    if (!token)
        return (reply.status(230).send({ error: 1019 }));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.data?.id;
    const isAdmin = decoded.data?.isAdmin;
    if (!id)
      return (reply.status(230).send({ error: "1016" }));
    if (!isAdmin)
      return (reply.status(230).send({ error: "user_not_an_admin" }));
    const dfa = decoded.data?.dfa;
    if (!dfa)
        return (reply.status(230).send({ error: "1020" }));
    done();
}

module.exports = isAdmin;

