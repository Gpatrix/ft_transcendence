import FormData from 'form-data';
import axios from 'axios';

export async function imageUpload(request: any, reply: any) {
    try {
        const parts = request.parts();
        let file: any = null;
        for await (const part of parts) {
            if (part.type === 'file') {
                file = part;
            }
            else
            {
                if (!request.body)
                    request.body = {};
                request.body[part.fieldname] = part.value;
            }
        }

        if (file)
        {
            const form = new FormData();
            const fileBuffer = await file.toBuffer();

            form.append('credential', process.env.API_CREDENTIAL);
            form.append('file', fileBuffer, {
                filename: file.filename || 'file.txt',
                contentType: file.mimetype || 'application/octet-stream'
            });
            
            //delete the old pp
            // if (foundUser.profPicture)
            // {
            //     const res = await fetch(`http://upload-service:3000/api/upload/${foundUser.profPicture}`, {
            //         method: 'DELETE',
            //         body: JSON.stringify({ credential: process.env.API_CREDENTIAL })
            //     });
            //     if (!(res?.ok))
            //         throw(new Error("cannot_delete_old_prof_pic"));
            // }
            const formHeaders = form.getHeaders();

            //upload the new pp
            const res = await axios.post('http://upload-service:3000/api/upload/', form, {
                headers: formHeaders
            });
            if (res.status != 200)
                return (reply.status(res.status).send({ error: res.data.error || "0500" }));
            const result = res.data;
            if (!request.body)
                request.body = {};
            request.body.image = `https://${process.env.HOST}:${process.env.PORT}/api/upload/${result.fileName}`;
        }
    } catch (error) {
        console.error("Error in image upload:", error);
        reply.status(500).send({ error: "0500" });
    }
}

export default imageUpload;