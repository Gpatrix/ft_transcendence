import client from 'prom-client'
import { FastifyInstance } from "fastify";

export const auth_requests_total = new client.Counter(
{
	name: 'auth_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: ['method'],
});

export async function metrics(fastify: FastifyInstance)
{

    
    fastify.get('/metrics', async (request, reply) =>
    {
        reply
        .header('Content-Type', client.register.contentType)
        .send(await client.register.metrics());
    });
}
