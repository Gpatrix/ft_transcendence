"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var speakeasy = require("speakeasy");
var QRCode = require('qrcode');
var jwt = require('jsonwebtoken');
function dfaRoutes(server, options, done) {
    // here the user for an url for getting a token (for example 420420)
    server.get('/api/auth/2fa/setup/ask', {}, async (req, res) => {
        try {
            const token = req.cookies['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenPayload = decoded.data;
            const secret = speakeasy.generateSecret();
            const response = await fetch(`http://user-service:3000/api/user/2fa/update/${tokenPayload.id}`, {
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
            QRCode.toDataURL(secret.otpauth_url, function (err, data_url) {
                if (err)
                    throw (err);
                res.status(200).send({ message: "qrcode_generated", data_url: data_url });
            });
        }
        catch (error) {
            res.status(500).send({ error: "server_error" });
        }
    });
    server.post('/api/auth/2fa/setup/submit', {}, async (req, res) => {
        const jsonWebToken = req.cookies['ft_transcendence_jw_token'];
        const decoded = jwt.verify(jsonWebToken, process.env.JWT_SECRET);
        const jsonWebTokenPayload = decoded.data;
        const { userToken } = req.body;
        //here we ask user api for user data
        const userLookupResponse = await fetch(`http://user-service:3000/api/user/lookup/${jsonWebTokenPayload.email}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credential: process.env.API_CREDENTIAL
            }),
        });
        const userLookupData = await userLookupResponse.json();
        if (!userLookupResponse.ok)
            return res.status(userLookupResponse.status).send({ error: userLookupData.error });
        const user = userLookupData;
        if (!user)
            return res.status(404).send({ error: "user_not_found" });
        if (!user.password)
            return res.status(401).send({ error: "account_created_with_provider" });
        // compare the first temp token the user got for example '420420'
        const verified = speakeasy.totp.verify({ secret: user.twoFactorSecretTemp,
            encoding: 'base32',
            token: userToken });
        if (verified) {
            //here we ask user api for updating user 2fa token
            const response = await fetch(`http://user-service:3000/api/user/2fa/update/${jsonWebTokenPayload.id}`, {
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
            res.clearCookie('ft_transcendence_jw_token', { path: '/' }).status(200).send({ message: "2fa_successfully_enabled" });
        }
        else
            return (res.status(401).send({ error: "invalid_code" }));
    });
    server.post('/api/auth/2fa/submit', {}, async (req, res) => {
        const jsonWebToken = req.cookies['ft_transcendence_jw_token'];
        const decoded = jwt.verify(jsonWebToken, process.env.JWT_SECRET);
        if (!decoded || !decoded.data || !decoded.data.id)
            return res.status(401).send({ error: "invalid_token" });
        if (decoded.data.dfa)
            return res.status(403).send({ error: "already_logged_in" });
        const jsonWebTokenPayload = decoded.data;
        const { userToken } = req.body;
        // compare the first temp token the user got for example '420420'
        const verified = speakeasy.totp.verify({ secret: jsonWebTokenPayload.twoFactorSecret,
            encoding: 'base32',
            window: 5,
            token: userToken });
        if (verified) {
            const jsonwebtoken = await jwt.sign({
                data: {
                    id: jsonWebTokenPayload.id,
                    email: jsonWebTokenPayload.email,
                    name: jsonWebTokenPayload.name,
                    isAdmin: jsonWebTokenPayload.isAdmin,
                    twoFactorSecret: jsonWebTokenPayload.twoFactorSecret,
                    dfa: true
                }
            }, process.env.JWT_SECRET, { expiresIn: '24h' });
            if (jsonwebtoken)
                return (res.cookie("ft_transcendence_jw_token", jsonwebtoken).send({ response: "successfully logged with 2fa" }));
        }
        else
            return (res.status(401).send({ error: "invalid_code" }));
    });
    server.delete('/api/auth/2fa/delete', {}, async (req, res) => {
        try {
            const token = req.cookies['ft_transcendence_jw_token'];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenPayload = decoded.data;
            if (!tokenPayload || !tokenPayload.id)
                return res.status(401).send({ error: "user_not_logged_in" });
            if (!tokenPayload.dfa)
                return res.status(403).send({ error: "user_not_logged_in_with_2fa" });
            const response = await fetch(`http://user-service:3000/api/user/2fa/update/${tokenPayload.id}`, {
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
            res.clearCookie('ft_transcendence_jw_token', { path: '/' }).status(200).send({ message: "2fa_successfully_disabled" });
        }
        catch (error) {
            res.status(500).send({ error: "server_error" });
        }
    });
    done();
}
module.exports = dfaRoutes;
