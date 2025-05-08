export async function validateUserData(request, reply) {

    let email;
    let name;
    let bio;
    let lang;

    if (request.body) {
        email = request.body.email;
        name = request.body.name;
        bio = request.body.bio;
        lang = request.body.lang;
    }
    else
    {
        const parts = request.parts()
        if (parts) {
            for await (const part of parts) {
                console.log("part", part.fieldname, part.type, part.value);
                if (part.fieldname === 'email')
                    email = part.value;
                else if (part.fieldname === 'name')
                    name = part.value;
                else if (part.fieldname === 'bio')
                    bio = part.value;
                else if (part.fieldname === 'lang')
                    lang = part.value;
            }
        }
    }

    console.log("email", email);
    console.log("name", name);
    console.log("bio", bio);

    if (email && email.length > 50)
        return (reply.status(400).send({ error: "email_too_long" }));
    if (name && name.length > 20)
        return (reply.status(400).send({ error: "name_too_long" }));
    if (bio && bio.length > 200)
        return (reply.status(400).send({ error: "bio_too_long" }));
    if (lang && lang != "0" && lang != "1" && lang != "2")
        return (reply.status(400).send({ error: "lang_not_supported" }));
    if (email && !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
        return (reply.status(400).send({ error: "forbidden_characters_in_email" }));
    if (name && !name.match(/^[a-zA-Z0-9._-]+$/))
        return (reply.status(400).send({ error: "forbidden_characters_in_name" }));
}

module.exports = validateUserData;