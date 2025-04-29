"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const password_1 = __importDefault(require("../validators/password"));
const client_1 = require("@prisma/client");
function authRoutes(server, options, done) {
    server.post('/api/auth/signin', { preHandler: [password_1.default] }, async (req, res) => {
        const { email, name, password } = req.body;
        if (!email)
            return (res.status(400).send({ error: "no_email" }));
        if (!name)
            return (res.status(400).send({ error: "no_name" }));
        if (!password)
            return (res.status(400).send({ error: "no_password" }));
        try {
            const hashedPassword = await bcrypt_1.default.hash(password, 12);
            const response = await fetch(`http://user-service:3000/api/user/create`, {
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
                res.status(response.status).send({ error: data.error });
            const user = data;
            if (!user)
                throw (new Error("cannot upsert user in prisma"));
            const token = await jsonwebtoken_1.default.sign({
                data: {
                    id: user.id,
                    email: email,
                    name: name,
                    isAdmin: false,
                    twoFactorSecret: user.twoFactorSecret,
                    dfa: true
                }
            }, process.env.JWT_SECRET, { expiresIn: '24h' });
            if (!token)
                throw (new Error("cannot generate user token"));
            return (res.cookie("ft_transcendence_jw_token", token).status(200).send({ response: "successfully signed in" }));
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                switch (error.code) {
                    case 'P2002':
                        res.status(403).send({ error: "this name is already used" });
                        break;
                    case 'P2003':
                        res.status(403).send({ error: "missing_arg" });
                        break;
                    case 'P2000':
                        res.status(403).send({ error: "too_long_arg" });
                        break;
                    default:
                        res.status(403).send({ error: error.message });
                }
            }
            return (res.status(500).send({ error: "server_error" }));
        }
    });
    server.post('/api/auth/login', async (request, reply) => {
        try {
            const email = request.body.email;
            const password = request.body.password;
            const response = await fetch(`http://user-service:3000/api/user/lookup/${email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    credential: process.env.API_CREDENTIAL
                }),
            });
            const data = await response.json();
            if (!response.ok)
                reply.status(response.status).send({ error: data.error });
            const user = data;
            if (!user)
                return reply.status(404).send({ error: "user_not_found" });
            if (!user.password)
                return reply.status(401).send({ error: "account_created_with_provider" });
            const isCorrect = await bcrypt_1.default.compare(password, user.password);
            if (!isCorrect)
                return reply.status(401).send({ error: "invalid_password " });
            if (user.isBanned)
                return reply.status(403).send({ error: "user_banned" });
            if (user.isTwoFactorEnabled) {
                const token = await jsonwebtoken_1.default.sign({
                    data: {
                        id: user.id,
                        email: email,
                        name: user.name,
                        isAdmin: user.isAdmin,
                        twoFactorSecret: user.twoFactorSecret,
                        dfa: false
                    }
                }, process.env.JWT_SECRET, { expiresIn: '24h' });
                if (!token)
                    throw (new Error("cannot generate user token"));
                reply.cookie("ft_transcendence_jw_token", token).send({ response: "successfully logged in", need2fa: true });
            }
            else {
                const token = await jsonwebtoken_1.default.sign({
                    data: {
                        id: user.id,
                        email: email,
                        name: user.name,
                        isAdmin: user.isAdmin,
                        twoFactorSecret: user.twoFactorSecret,
                        dfa: true
                    }
                }, process.env.JWT_SECRET, { expiresIn: '24h' });
                if (!token)
                    throw (new Error("cannot generate user token"));
                reply.cookie("ft_transcendence_jw_token", token).send({ response: "successfully logged in", need2fa: false });
            }
        }
        catch (error) {
            reply.status(500).send({ error: "server_error" });
        }
    });
    server.delete('/api/auth/logout', async (request, reply) => {
        const token = request.body.token;
        if (!token)
            return (reply.status(401).send({ error: "no_token_provided" }));
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const id = decoded.data?.id;
        if (!id)
            return (reply.status(401).send({ error: "invalid_token_provided" }));
        reply.clearCookie('ft_transcendence_jw_token', {}).send({ response: "logout_success" });
    });
    server.get('/api/auth/login/google/callback', async function (request, reply) {
        try {
            const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
            if (!token)
                throw (Error("no_google_token_generated"));
            const userinfo = await server.googleOAuth2.userinfo(token.access_token);
            if (!userinfo)
                throw (Error("cannot_get_user_infos"));
            let user;
            const response = await fetch(`http://user-service:3000/loopkup/${userinfo.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credential: process.env.API_CREDENTIAL
                })
            });
            user = await response?.json();
            if (!user) {
                const response = await fetch(`http://user-service:3000/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userinfo.email,
                        profPicture: userinfo.picture,
                        name: userinfo.name
                    }),
                });
                const data = await response?.json();
                if (!response.ok)
                    return (reply.status(response.status).send({ error: data.error }));
                user = data;
            }
            const jsonwebtoken = await jsonwebtoken_1.default.sign({
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    twoFactorSecret: user.twoFactorSecret,
                    dfa: true
                }
            }, process.env.JWT_SECRET, { expiresIn: '24h' });
            if (jsonwebtoken)
                return (reply.cookie("ft_transcendence_jw_token", jsonwebtoken).send({ response: "successfully logged with google" }));
            else
                throw new Error("no token generated");
        }
        catch (error) {
            reply.status(500).send({ error: "server_error" });
        }
        // if later need to refresh the token this can be used
        // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)
    });
    done();
}
module.exports = authRoutes;
