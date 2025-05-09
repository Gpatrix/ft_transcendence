function validateLobbyData(request, reply, done) {
    const body = request.body;
    const lobbyTitle = body?.title;
    const playersCount = body?.playersCount;

    if (lobbyTitle < 1 || lobbyTitle > 30)
        return reply.status(400).send({ error: 5005 });
    if (playersCount % 2 != 0)
        return reply.status(400).send({ error: 5006 });
    if (playersCount < 4 || playersCount > 32)
        return reply.status(400).send({ error: 5007 });
    done();
}

module.exports = validateLobbyData;