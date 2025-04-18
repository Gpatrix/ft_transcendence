import { FastifyInstance } from "fastify";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

function authRoutes (server: FastifyInstance, options: any, done: any)
{

    interface signInBody {
        email: string,
        name: string,
        password: string,
    }
    
    server.post<{ Body: signInBody }>('/api/user/signin', async (req, res) => {
        const { email, name, password } = req.body;
        if (!email)
            return (res.status(400).send({ error: "no_email" }));
        if (!name)
            return (res.status(400).send({ error: "no_name" }));
        if (!password)
            return (res.status(400).send({ error: "no_password" }));
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await prisma.user.upsert({
            where: { email: email },
            update: {},
            create: {
                email: email,
                name: name,
                password: hashedPassword
            },
            })
            if (!user)
            throw(new Error("cannot upsert user in prisma"));
            const token = await jwt.sign({
            data: {
                id: user.id,
                email: email,
                name: name,
                isAdmin: false
            }
            }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
            if (!token)
                throw(new Error("cannot generate user token"));
            return (res.cookie("ft_transcendence_jw_token", token).status(200).send({ response: "successfully signed in" }));
        } catch (error) {
            return (res.status(500).send({ error: "server_error"}));
        }
    });

    interface loginBody {
      email: string
      password: string
    }
    
    server.post<{ Body: loginBody }>('/api/user/login', async (request, reply) => {
        const email = request.body.email;
        const password = request.body.password;
        const user = await prisma.user.findUnique({
            where: { 
            email: email 
            }
        })
        if (!user)
            return reply.status(404).send({ error: "user_not_found" });
        const isCorrect = await bcrypt.compare(password as string, user.password);
        if (!isCorrect)
            return reply.status(401).send({ error: "invalid_password "});
        const token = await jwt.sign({
            data: {
            id: user.id,
            email: email,
            name: user.name,
            isAdmin: user.isAdmin
            }
        }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
        reply.cookie("ft_transcendence_jw_token", token).send({ response: "successfully logged in" });
    })

    interface logoutParams {
        token: string
      }
      
    server.delete<{ Body: logoutParams }>('api/user/logout', async (request, reply) => {
        const token = request.body.token;
        if (!token)
            return (reply.status(401).send({ error: "no_token_provided" }));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.data?.id
        if (!id)
          return (reply.status(401).send({ error: "invalid_token_provided" }));
        reply.clearCookie('ft_transcendence_jw_token', {}).send({ response: "logout_success" });
    })

    server.get('/api/auth/login/google/callback', async function (request, reply) {
        try {
            const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
            if (!token)
                throw (Error ("no_google_token_generated"));
            const userinfo = await server.googleOAuth2.userinfo(token.access_token); 
            if (!userinfo)
                throw (Error ("cannot_get_user_infos"));
            let user: User;
            const response = await fetch(`http://user-service:3000/search/${userinfo.email}`, {
                method: "GET"
            })
            user = await response?.json();
            if (!user)
            {
                const response = await fetch(`http://user-service:3000/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userinfo.email,
                        prof_picture = userinfo.picture,
                        name: userinfo.name
                    }),
                });

            }
            const jsonwebtoken = await jwt.sign({
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin
            }
            }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
            if (jsonwebtoken)
                return (reply.cookie("ft_transcendence_jw_token", jsonwebtoken).send({ response: "successfully logged with google" }));
            else
                throw new Error("no token generated");
        } catch (error) {
            reply.status(500).send({ error: "server_error" })
        }
        
        
        // if later need to refresh the token this can be used
        // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)
    
    })
      
    done()
}

module.exports = authRoutes;