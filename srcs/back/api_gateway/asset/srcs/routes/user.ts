import { FastifyInstance } from "fastify";

function userRoutes (server: FastifyInstance, options: any, done: any)
{
    interface LoginRequestBody {
        username?: string;
        password?: string;
        userinfo?: any;
    }
      
    server.post<{ Body: LoginRequestBody }>('/api/user/login', async (req, res) => {
    const response = await fetch(`${process.env.AUTH_SERVICE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (response.ok)
        res.cookie("ft_transcendence_jw_token", data.response)
    res.status(response.status).send(data);
    });
    
    server.post('/api/user/signin', async (req, res) => {
    const response = await fetch(`${process.env.AUTH_SERVICE}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (response.ok)
        res.cookie("ft_transcendence_jw_token", data.response)
    res.status(response.status).send(data);
    });
    
    server.delete('/api/user/logout', async (req, res) => {
    const response = await fetch(`${process.env.AUTH_SERVICE}/logout`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.clearCookie('ft_transcendence_jw_token', {}).clearCookie('ft_transcendence_google_token', {}).status(response.status).send(data);
    });
    
    interface getUserParams {
    id: string
    }
    
    server.get<{ Params: getUserParams }>('/api/user/search/:id', async (req, res) => {
    const response = await fetch(`${process.env.AUTH_SERVICE}/search/${req.params.id}`, { method: 'GET' });
    const data = await response.json();
    res.status(response.status).send(data);
    });
      
    done()
}

module.exports = userRoutes;