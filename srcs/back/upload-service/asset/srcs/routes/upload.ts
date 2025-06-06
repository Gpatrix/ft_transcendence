import { FastifyInstance } from "fastify";
import fs from 'fs';
import path from 'path';
import util from 'util'
import { pipeline } from 'stream'

const pump = util.promisify(pipeline);

// function isMimeTypeAllowed(file: any): boolean {
//       const allowedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf'];

//     if (allowedMimeTypes.includes(file.mimetype))
//         return (true);
//     else
//         return (false);
// }

export default function uploadRoutes (server: FastifyInstance, options: any, done: any)
{

    interface uploadPostBody {
        file: any,
        credential: string
    }
    
    server.post<{ Body: uploadPostBody }>('/api/upload/', async (req: any, res: any) => {
        try {
            console.log('upload')
            const parts = await req.parts();
            let credential: string | undefined;
            let file: any;
            for await (const part of parts) {
                console.log('part', part);
                if (part.type === 'file')
                    file = part;
                if (part.fieldname === 'credential') {
                    credential = part.value;
                }
            }
            if (credential != process.env.API_CREDENTIAL)
                return (res.status(401).send({ error: "0401" }));  // private route (:
            console.log(file);
            const extName = path.extname(file.filename);
            if (extName !== '.png' && extName !== '.jpeg' && extName !== '.jpg')
                return (res.status(415).send({ error: "6001" }));
            if (!file)
                return (res.status(420).send({ error: "6002" }));
            const fileName = Date.now();
            const storedFile = fs.createWriteStream(`./uploads/${fileName}`);
            pump(file.file, storedFile);
            res.status(200).send({ fileName: fileName });
        } catch (error) {
            console.error('Error during file upload:', error);
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