import { FastifyInstance } from "fastify";
import fs from 'fs';
import pump from 'pump';

function uploadRoutes (server: FastifyInstance, options: any, done: any)
{

    interface uploadPostBody {
        file: any,
        credential: string
    }
    
    server.post<{ Body: uploadPostBody }>('/api/upload/', async (req: any, res: any) => {
        try {
            const file = await req.file();
            const parts = await req.parts();
            const credential = file.fields.credential.value;
            if (credential != process.env.API_CREDENTIAL)
                return (res.status(401).send({ error: "private_route" }));  // private route (:
            if (!file)
                return (res.status(420).send({ error: "no_file_uploaded" }));
            const fileName = Date.now()
            const storedFile = fs.createWriteStream(`./uploads/${fileName}`);
            pump(file.file, storedFile);
            res.status(200).send({ fileName: fileName });
        } catch (error) {
            res.status(500).send({ error: "0500" });
        }
    });

    interface uploadDeleteBody {
        credential: string
    }

    interface uploadDeleteParams {
        fileName: string
    }

    server.delete<{ Body: uploadDeleteBody, Params: uploadDeleteParams}>('/api/upload/:fileName', async (req: any, res: any) => {
        try {
            const credential = req.body.credential;
            const fileName = req.params.fileName
            if (credential != process.env.API_CREDENTIAL)
                return (res.status(401).send({ error: "private_route" }));  // private route (:
            fs.unlink(`../uploads/${fileName}`, err => {});
            res.status(200).send({ message: 'file_successfully_deleted' });
        } catch (error) {
            res.status(500).send({ error: "0500" });
        }
    });

    done()
}

module.exports = uploadRoutes;