const jwt = require("jsonwebtoken");

export function isAdmin(request, reply, done) {
    const token = request.cookies.ft_transcendence_jw_token;
    if (!token)
        return (reply.status(401).send({ error: "user_not_logged_in" }));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.data?.id;
    const isAdmin = decoded.data?.isAdmin;
    if (!id)
      return (reply.status(401).send({ error: "invalid_token_provided" }));
    if (!isAdmin)
      return (reply.status(401).send({ error: "user_not_an_admin" }));
    done();
}

module.exports = isAdmin;

