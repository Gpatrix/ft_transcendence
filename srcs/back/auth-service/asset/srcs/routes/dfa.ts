import { FastifyInstance } from "fastify";
var speakeasy = require("speakeasy");
var QRCode = require('qrcode');
var jwt = require('jsonwebtoken');

function dfaRoutes (server: FastifyInstance, options: any, done: any)
{
    // here the user for an url for getting a token (for example 420420)
    server.get('/api/auth/2fa/setup/ask', {}, async (req, res) => {
        try {
            const token = req.cookies['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenPayload = decoded.data;
            const secret = speakeasy.generateSecret({
                    name: `ft_transcendance:${tokenPayload.email}`, 
                    issuer: 'ft_transcendance'
            }
            );
            const response = await fetch(`http://user-service:3000/api/user/2fa/update/${tokenPayload.id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    twoFactorSecretTemp: secret.base32,
                    credential: process.env.API_CREDENTIAL
                }),
            });
            const data = await response.json();
            if (!response.ok)
                res.status(response.status).send(data);
            const data_url = await QRCode.toDataURL(secret.otpauth_url);
            return (res.status(200).send({ message: "qrcode_generated", data_url }));
        } catch (error) {
            res.status(500).send({ error: "0500" });
        }
    });

    interface dfaSetupAskBody {
        userToken: string,
    }

    server.post<{ Body: dfaSetupAskBody }>('/api/auth/2fa/setup/submit', {}, async (req, res) => {
        const jsonWebToken= req.cookies['ft_transcendence_jw_token'];
        const decoded = jwt.verify(jsonWebToken, process.env.JWT_SECRET);
        const jsonWebTokenPayload = decoded.data;
        const userToken  = req.body.userToken;

        //here we ask user api for user data
        const userLookupResponse = await fetch(`http://user-service:3000/api/user/lookup/${jsonWebTokenPayload.email}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credential: process.env.API_CREDENTIAL
            }),
        });
        const userLookupData = await userLookupResponse.json();
        if (!userLookupResponse.ok)
            return res.status(userLookupResponse.status).send({ error: userLookupData.error})
        const user = userLookupData;
        if (!user)  
            return res.status(404).send({ error: "1006" });

        // compare the first temp token the user got for example '420420'
        const verified = speakeasy.totp.verify({ 
            secret: user.twoFactorSecretTemp,
            encoding: 'base32',
            token: userToken,
            window: 2
        }); 
        if (verified)
        {
             //here we ask user api for updating user 2fa token
            const response = await fetch(`http://user-service:3000/api/user/2fa/update/${jsonWebTokenPayload.id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    twoFactorSecret: user.twoFactorSecretTemp,
                    credential: process.env.API_CREDENTIAL
                }),
            });
            const data = await response.json();
            if (!response.ok)
                return (res.status(response.status).send(data));
            res.clearCookie('ft_transcendence_jw_token', {path: '/'}).status(200).send({ message: "2fa_successfully_enabled" })
        }
        else
            return (res.status(401).send({ error: "1017" }));
    });

    interface dfaSubmitBody {
        userToken: string,
    }

    server.post<{ Body: dfaSubmitBody }>('/api/auth/2fa/submit', {}, async (req, res) => {
        const jsonWebToken= req.cookies['ft_transcendence_jw_token'];
        const decoded = jwt.verify(jsonWebToken, process.env.JWT_SECRET);
        if (!decoded || !decoded.data || !decoded.data.id)
            return res.status(401).send({ error: "1016" });
        if (decoded.data.dfa)
            return res.status(403).send({ error: "1018" });
        const jsonWebTokenPayload = decoded.data;
        const userToken = req.body;

        // compare the first temp token the user got for example '420420'
        const verified = speakeasy.totp.verify({ secret: jsonWebTokenPayload.twoFactorSecret,
            encoding: 'base32',
            window: 5,
            token: userToken });
        if (verified)
        {
            const jsonwebtoken = await jwt.sign({
            data: {
                id: jsonWebTokenPayload.id,
                email: jsonWebTokenPayload.email,
                name: jsonWebTokenPayload.name,
                isAdmin: jsonWebTokenPayload.isAdmin,
                twoFactorSecret: jsonWebTokenPayload.twoFactorSecret,
                dfa: true
            }
            }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
            if (jsonwebtoken)
                return (res.cookie("ft_transcendence_jw_token", jsonwebtoken,  {
                    path: "/",
                    httpOnly: true,
                    sameSite: "none",
                    secure: true
                  })).send({ response: "successfully logged with 2fa" });
        }
        else
            return (res.status(401).send({ error: "1017" }));
    });

    server.delete('/api/auth/2fa/delete', {}, async (req, res) => {
        try {
            const token = req.cookies['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenPayload = decoded.data;
            if (!tokenPayload || !tokenPayload.id)
                return res.status(401).send({ error: 1019 });
            if (!tokenPayload.dfa)
                return res.status(403).send({ error: "1020" });
            const response = await fetch(`http://user-service:3000/api/user/2fa/update/${tokenPayload.id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    twoFactorSecretTemp: null,
                    isTwoFactorEnabled: false,
                    credential: process.env.API_CREDENTIAL
                }),
            });
            const data = await response.json();
            if (!response.ok)
                res.status(response.status).send(data);
            res.clearCookie('ft_transcendence_jw_token', {path: '/'}).status(200).send({ message: "2fa_successfully_disabled" });
        } catch (error) {
            res.status(500).send({ error: "0500" });
        }
    });

    done()
}

module.exports = dfaRoutes;