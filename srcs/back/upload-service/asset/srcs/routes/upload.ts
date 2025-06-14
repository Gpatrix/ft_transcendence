import { FastifyInstance } from "fastify";
import fs from 'fs';
import path from 'path';
import util from 'util'
import { pipeline } from 'stream'
import jwt from 'jsonwebtoken';
import { isConnected } from "../validators/jsonwebtoken";

const pump = util.promisify(pipeline);

export default function uploadRoutes (server: FastifyInstance, options: any, done: any)
{

    interface uploadPostBody {
        file: any,
    }
    
    server.post<{ Body: uploadPostBody }>('/api/upload/', { preHandler: [isConnected] }, async (req: any, res: any) => {
        try {
            const token = req.cookies['ft_transcendence_jw_token'];
            if (!token)
                return (res.status(230).send({ error: "0401" }));  // private route (:
            const tokenPayload = jwt.decode(token).data;
            if (!tokenPayload || !tokenPayload.id)
                return (res.status(230).send({ error: "0401" }));  // private route (:
            const file = await req.file();
            if (!file)
                return (res.status(230).send({ error: "6002" }));
            const extName = path.extname(file.filename);
            if (extName !== '.png' && extName !== '.jpeg' && extName !== '.jpg')
                return (res.status(230).send({ error: "6001" }));
            const fileName = String(Date.now());
            const storedFilePath = path.join(__dirname, `../../uploads/${fileName}`);
            const storedFile = fs.createWriteStream(storedFilePath);
            await pump(file.file, storedFile);
            const fileNameURL = `https://${process.env.HOST}:${process.env.PORT}/api/upload/${fileName}`
            const response = await fetch(`http://user-service:3000/api/user/profile_picture`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credential: process.env.API_CREDENTIAL,
                    profPicture: fileNameURL,
                    id: tokenPayload.id
                }),
            });
            if (response.status == 230) {
                // const resJson = await response.json();
                // const error = resJson?.error;
                console.error('Error during file upload:', response);
                return res.status(230).send({ error: '0500' });
            }
            res.status(200).send({ fileName: fileNameURL });
        } catch (error) {
            console.error('Error during file upload:', error);
            res.status(230).send({ error: "0500" });
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
                return (res.status(230).send({ error: "private_route" }));  // private route (:
            fs.unlink(`../uploads/${fileName}`, err => {});
            res.status(200).send({ message: 'file_successfully_deleted' });
        } catch (error) {
            res.status(230).send({ error: "0500" });
        }
    });

    done()
}