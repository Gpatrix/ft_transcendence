import { FastifyInstance } from "fastify";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validatePassword  from "../validators/password";
import isConnected from '../validators/jsonwebtoken';

function authRoutes (server: FastifyInstance, options: any, done: any)
{
    interface signUpBody {
        email: string,
        name: string,
        password: string,
    }
    
    server.post<{ Body: signUpBody }>('/api/auth/signup', { preHandler:[validatePassword], config: {
        rateLimit: {
            max: 10,
            timeWindow: '1 minute'
        }
    } }, async (req, res) => {
        const { email, name, password } = req.body;
        if (!email)
            return (res.status(400).send({ error: "1007" }));
        if (!name)
            return (res.status(400).send({ error: "1008" }));
        if (!password)
            return (res.status(400).send({ error: "1009" }));
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const response = await fetch(`http://user-service:3000/api/user/create`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    name: name,
                    password: hashedPassword,
                    credential: process.env.API_CREDENTIAL
                }),
            });
            const data = await response.json();
            if (!response.ok)
                return (res.status(response.status).send({ error: data.error}))
            const user = data;
            if (!user)
                throw(new Error("cannot upsert user in prisma"));
            const token = await jwt.sign({
            data: {
                id: user.id,
                email: email,
                name: name,
                isAdmin: false,
                twoFactorSecret: user.twoFactorSecret,
                dfa: true
            }
            }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
            if (!token)
                throw(new Error("cannot generate user token"));
            return (res.cookie("ft_transcendence_jw_token", token, {
                path: "/",
                httpOnly: true,
                sameSite: "none",
                secure: true
              }).send({ response: "successfully logged in", need2fa: false }));
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
                {
                    switch (error.code) {
                        case 'P2002':
                            res.status(401).send({ error: "1003"});
                            break
                        case 'P2003':
                            res.status(401).send({ error: "1011"});
                          break
                        case 'P2000':
                            res.status(401).send({ error: "1012"});
                          break
                        default:
                            res.status(401).send({ error: "0500"});
                    }
            }
            return (res.status(500).send({ error: "0500"}));
        }
    });

    interface loginBody {
      email: string
      password: string
    }
    
    server.post<{ Body: loginBody }>('/api/auth/login', { config:
        {
            rateLimit: {
                max: 10,
                timeWindow: '1 minutes'
            } 
        }
        }, async (request: any, reply: any) => {
        try {
            const email = request.body.email;
            const password = request.body.password;
            if (!email || !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
                return (reply.status(400).send({ error: "1007" }));
            const response = await fetch(`http://user-service:3000/api/user/lookup/${email}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    credential: process.env.API_CREDENTIAL
                }),
            });
            const data = await response.json();
            
            if (!response.ok)
                reply.status(response.status).send({ error: data.error})
            const user = data;
            if (!user || user.provider)
                return reply.status(404).send({ error: "1006" });
            if (!user.password)
                return reply.status(401).send({ error: "1014" });
            const isCorrect = await bcrypt.compare(password as string, user.password);
            if (!isCorrect)
                return reply.status(401).send({ error: "1006"});
            if (user.isBanned)
                return reply.status(403).send({ error: "1013" });
            if (user.isTwoFactorEnabled) {
                const token = await jwt.sign({
                    data: {
                    id: user.id,
                    email: email,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    twoFactorSecret: user.twoFactorSecret,
                    dfa: false
                    }
                }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
                if (!token)
                    throw (new Error("cannot generate user token"));
                return (reply.cookie("ft_transcendence_jw_token", token, {
                    path: "/",
                    httpOnly: true,
                    sameSite: "none",
                    secure: true
                  }).send({ response: "successfully logged in", need2fa: true }));
            }
            else {
                const token = await jwt.sign({
                    data: {
                    id: user.id,
                    email: email,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    twoFactorSecret: user.twoFactorSecret,
                    dfa: true
                    }
                }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
                if (!token)
                    throw (new Error("cannot generate user token"));
                return (reply.cookie("ft_transcendence_jw_token", token, {
                    path: "/",
                    httpOnly: true,
                    sameSite: "none",
                    secure: true
                  }).send({ response: "successfully logged in", need2fa: false }));
            }
        } catch (error) {
            reply.status(500).send({ error:"0500" });
        }
    })

    interface logoutParams {
        token: string
      }
      
    server.delete<{ Body: logoutParams }>('/api/auth/logout', async (request, reply) => {
        const token = request.cookies['ft_transcendence_jw_token'];
        if (!token)
            return (reply.status(401).send({ error: "1016" }));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.data?.id
        if (!id)
          return (reply.status(401).send({ error: "1016" }));
        reply.clearCookie('ft_transcendence_jw_token', {}).send({ response: "logout_success" });
    })


    type LookupUserError = {
        error: number;
      };
    type LookupUserSuccess = {
        id: number;
        email: string;
        name: string;
        error?: never;
      };
    type LookupUserResponse = LookupUserError | LookupUserSuccess


    server.get('/api/auth/login/google/callback', async function (request, reply) {
        try {
            const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
            if (!token)
                throw (Error("no_google_token_generated"));
    
            const userinfo = await server.googleOAuth2.userinfo(token.access_token); 
            if (!userinfo)
                throw (Error("cannot_get_user_infos"));
            console.log('User info from Google:', userinfo);

            const response = await fetch(`http://user-service:3000/api/user/lookup/${userinfo.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  credential: process.env.API_CREDENTIAL,
                })
            });
            let user;
            const lookupData = await response.json();
            if (response.ok && !('error' in lookupData)) {
                if (!(lookupData.provider) || lookupData.provider !== 'google')
                    return (reply.status(403).redirect("/register?oauth-error=1014"));
                user = lookupData;
            }
            else 
            {
                const translatedName= userinfo.given_name.trim().replace(/[^a-zA-Z0-9 ]/g, '_');

                const createResponse = await fetch(`http://user-service:3000/api/user/create`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: userinfo.email,
                    profPicture: userinfo.picture,
                    name: translatedName,
                    provider: 'google',
                    credential: process.env.API_CREDENTIAL
                  }),
                });

                
                
                if (!createResponse.ok) {
                    const errorData = await createResponse.json();
                    return reply.status(createResponse.status).redirect(`/register?oauth-error=${errorData.error || '1015'}`);
                }
                
                user = await createResponse.json();
                console.log('New user created:', user);
            }
            const payloadBase = {
                id: user.id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin,
                twoFactorSecret: user.twoFactorSecret,
            };
            const jwtPayload = {
                data: {
                    ...payloadBase,
                    dfa: !user.isTwoFactorEnabled
                }
            };
            const jsonwebtoken = await jwt.sign(jwtPayload, process.env.JWT_SECRET as string, { expiresIn: '24h' });

            if (jsonwebtoken)
                return (reply.cookie("ft_transcendence_jw_token", jsonwebtoken, {
                    path: "/",
                    httpOnly: true,
                    sameSite: "none",
                    secure: true
                  }).redirect("/login?oauth=true&need2fa=${user.isTwoFactorEnabled}"));
            else
                throw new Error("no token generated");
        } catch (error) {
            return (reply.redirect("/register?oauth-error=0500"));
        }
    });

    server.get('/api/auth/status', async function (request, reply) {
        const connected = await isConnected(request, reply, ()=> {
            return (reply.status(200).send({ message: "logged_in" }));
        })
    });

    done();    
}

module.exports = authRoutes;