import jwt, { JwtPayload } from 'jsonwebtoken';
import { i_token } from "../utils/getTokenData";

export default function isConnected(request: any, reply: any, done: any)
{
    try
    {
        const token: string | undefined = request.cookies.ft_transcendence_jw_token
        if (!token || token === undefined)
            return (reply.status(230).send({ error: "0403" }));
        const decoded: i_token = (jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload).data;
        const id = decoded.id;
        if (id === undefined)
            return (reply.status(230).send({ error: "1016" }));
          const dfa = decoded.dfa;
          if (dfa === undefined)
              return (reply.status(230).send({ error: "1020" }));
        done();
    }
    catch (error) {
        return (reply.status(230).send({ error: "0403" }));
    }
    done();
}