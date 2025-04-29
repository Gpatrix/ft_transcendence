"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = __importDefault(require("../mail"));
var bcrypt = require("bcrypt");
const expireIn = 5;
function passwordResetRoutes(server, options, done) {
    server.post('/api/auth/passwordReset/ask', {}, async (req, res) => {
        try {
            const email = req.body.email;
            if (!email)
                return res.status(400).send({ error: "missing_key" });
            const userLookupResponse = await fetch(`http://user-service:3000/api/user/lookup/${email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    credential: process.env.API_CREDENTIAL
                }),
            });
            const userLookupData = await userLookupResponse.json();
            if (!userLookupResponse.ok)
                return res.status(userLookupResponse.status).send({ error: userLookupData.error });
            const user = userLookupData;
            if (!user)
                return res.status(404).send({ error: "user_not_found" });
            const passwordResetToken = await jsonwebtoken_1.default.sign({
                data: {
                    email
                }
            }, process.env.JWT_SECRET, { expiresIn: expireIn * 60 * 1000 });
            await (0, mail_1.default)(email, 'Password reset', `You asked for a password reset, here is you secret token: ${passwordResetToken}\nIt will at ${expireIn} minutes`);
            res.status(200).send({ message: "mail sent" });
        }
        catch (error) {
            res.status(500).send({ error: "server_error" });
        }
    });
    server.post('/api/auth/passwordReset/submit', {}, async (req, res) => {
        try {
            const password = req.body.password;
            const token = req.body.token;
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const email = decoded.data?.email;
            if (!email)
                return res.status(401).send({ error: "invalid_token" });
            const newPassword = await bcrypt.hash(password, 12);
            const userPasswordUpdate = await fetch(`http://user-service:3000/api/user/password/${email}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credential: process.env.API_CREDENTIAL,
                    password: newPassword,
                }),
            });
            const data = await userPasswordUpdate.json();
            if (!userPasswordUpdate.ok)
                return res.status(userPasswordUpdate.status).send({ error: data.error });
            res.status(200).send({ message: "user_password_updated" });
        }
        catch (error) {
            res.status(500).send({ error: "server_error" });
        }
    });
    done();
}
module.exports = passwordResetRoutes;
