import { FastifyInstance } from "fastify";
import jwt from 'jsonwebtoken';
import sendMail from '../mail';
import bcrypt from 'bcryptjs';

const expireIn = 5;

function passwordResetRoutes(server: FastifyInstance, options: any, done: any)
{
    interface passwordResetAskBody {
        email: string,
    }

    server.post<{ Body: passwordResetAskBody }>('/api/auth/passwordReset/ask', {}, async (req, res) => {
        try {
            const email = req.body.email;
            if (!email)
                return res.status(230).send({ error: "missing_key" });
            const userLookupResponse = await fetch(`http://user-service:3000/api/user/lookup/${email}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    credential: process.env.API_CREDENTIAL
                }),
            });
            const userLookupData = await userLookupResponse.json();
            if (!userLookupResponse.ok)
                return res.status(userLookupResponse.status).send({ error: userLookupData.error})
            const user = userLookupData;
            if (!user)
                return res.status(230).send({ error: "1006" });
            const passwordResetToken = await jwt.sign({
            data: {
                email
            }
            }, process.env.JWT_SECRET as string, { expiresIn: expireIn * 60 * 1000 });
            const link : string = `https://${process.env.HOST}:${process.env.PORT}/forgot-password/new-password?token=${passwordResetToken}`
            if (userLookupData)
                await sendMail(email, 'Password reset', `You asked for a password reset, here is your link ${link}\nIt will expire at ${expireIn} minutes`);
            // console.log(`Retrieve-link : ${link}`)
            res.status(200).send({ message: "mail sent" });
        } catch (error) {
            console.log(error)
            res.status(230).send({ error: "0500" });
        }
    });

    interface passwordResetSubmitBody {
        token: string,
        password:string
    }

    server.post<{ Body: passwordResetSubmitBody }>('/api/auth/passwordReset/submit', {}, async (req, res) => {
        try {
            const password = req.body.password;
            const token = req.body.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.data?.email;
            if (!email)
                return res.status(230).send({ error: "1016" });
            const newPassword = await bcrypt.hash(password, 12);
            const userPasswordUpdate = await fetch(`http://user-service:3000/api/user/password/${email}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credential: process.env.API_CREDENTIAL,
                    password: newPassword,
                }),
            }); 
            const data = await userPasswordUpdate.json();
            if (!userPasswordUpdate.ok)
                return res.status(userPasswordUpdate.status).send({ error: "1016"})
            res.status(200).send({ message: "user_password_updated" });
        } catch (error) {
            res.status(230).send({ error: "1016" });
        }
    });
    done();
}

module.exports = passwordResetRoutes;


