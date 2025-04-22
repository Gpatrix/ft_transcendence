import { FastifyInstance } from "fastify";
var speakeasy = require("speakeasy");
var QRCode = require('qrcode');
var jwt = require('jsonwebtoken');

function dfaRoutes (server: FastifyInstance, options: any, done: any)
{

    // here the user for an url for getting a token (for example 420420)
    server.get('/api/auth/2fa/setup/ask', {}, async (req, res) => {
        const token = req.cookies['ft_transcendence_jw_token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenPayload = decoded.data;
        const secret = speakeasy.generateSecret();
        const response = await fetch(`http://user-service:3000/api/user/2fa/temp_2fa_token/${tokenPayload.id}`,
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
        QRCode.toDataURL(secret.otpauth_url, function(err: any, data_url: any) {
            if (err)
                res.status(response.status).send({ error: "cannot_generate_qrcode"});
            
            console.log('<img src="' + data_url + '">');
        });
    });

    interface dfaSetupAskBody {
        userToken: string,
    }

    server.post<{ Body: dfaSetupAskBody }>('/api/auth/2fa/setup/submit', {}, async (req, res) => {
        const jsonWebToken= req.cookies['ft_transcendence_jw_token'];
        const decoded = jwt.verify(jsonWebToken, process.env.JWT_SECRET);
        const jsonWebTokenPayload = decoded.data;
        const { userToken } = req.body;

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
            return res.status(404).send({ error: "user_not_found" });
        if (!user.password)
            return res.status(401).send({ error: "account_created_with_provider" });

        // compare the first temp token the user got for example '420420'
        const verified = speakeasy.totp.verify({ secret: user.twoFactorSecretTemp,
            encoding: 'base32',
            token: userToken });
        if (verified)
        {}

        //here we ask user api for updating user 2fa token
        const response = await fetch(`http://user-service:3000/api/user/2fa/temp_2fa_token/${jsonWebTokenPayload.id}`,
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
        res.status(200).send({ message: "2fa_successfully_enabled" })

    });
    done()
}

module.exports = dfaRoutes;