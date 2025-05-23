import client from 'prom-client'
import { FastifyInstance } from "fastify";

export async function metrics(fastify: FastifyInstance)
{
    const user_requests_total = new client.Counter(
    {
      name: 'user_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method'],
    });
    
    fastify.addHook('onResponse', (req, res, done) =>
    {
      user_requests_total.inc({method: req.method});
      done();
    });
    
    fastify.get('/metrics', async (request, reply) =>
    {
        reply
        .header('Content-Type', client.register.contentType)
        .send(await client.register.metrics());
    });
}
