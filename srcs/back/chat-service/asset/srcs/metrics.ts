import client from 'prom-client'
import { FastifyInstance } from "fastify";

export const chat_requests_total = new client.Counter(
{
	name: 'chat_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: ['method'],
});

export async function metrics(fastify: FastifyInstance)
{
    new client.Gauge({
      name: 'chat_activ_conn',
      help: 'active connextion on site',
      collect() {this.set(activeConn.size);},
    });
    
    fastify.get('/metrics', async (request, reply) =>
    {
        reply
        .header('Content-Type', client.register.contentType)
        .send(await client.register.metrics());
    });
}