export function validateUserData(request, reply, done) {

    const email = request.body?.email;
    const name = request.body?.name;
    const bio = request.body?.bio;
    const lang = request.body?.lang;

    if (email && email.length > 50)
        return (reply.status(400).send({ error: "email_too_long" }));
    if (name && name.length > 20)
        return (reply.status(400).send({ error: "name_too_long" }));
    if (bio && bio.length > 200)
        return (reply.status(400).send({ error: "bio_too_long" }));
    if (lang && lang != "fr" && lang != "en")
        return (reply.status(400).send({ error: "lang_not_supported" }));

    if (email && !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
        return (reply.status(400).send({ error: "forbidden_characters_in_email" }));
    if (name && !name.match(/^[a-zA-Z0-9._-]+$/))
        return (reply.status(400).send({ error: "forbidden_characters_in_name" }));

    done();
}

module.exports = validateUserData;