import deleteImage from "../utils/deleteImage";

export default async function validateUserData(request: any, reply: any) {
    try {
        const { email, name, bio, lang } = request.body || {};

        try {
            if (email && email.length > 50)
                throw new Error("1004");
            if (name && name.length > 20)
                throw new Error("1005");
            if (bio && bio.length > 200)
                throw new Error("1011");
            // if (lang && !["en", "fr", "ro"].includes(lang))
            //     throw new Error("0401");
            if (email && !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
                throw new Error("1004");
            if (name && !name.match(/^[a-zA-Z0-9._\- ]+$/))
                throw new Error("1005");
        } catch (error: any) {
            reply.status(230).send({ error: error.message });
            if (request.body?.image)
                deleteImage(request.body.image);
        }
    } catch (error) {
        console.error("Error in validateUserData:", error);
        reply.status(230).send({ error: '0500' });
    }
}