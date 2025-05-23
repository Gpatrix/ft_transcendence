import client from 'prom-client'
import { FastifyInstance } from "fastify";

export async function metrics(fastify: FastifyInstance)
{
    const auth_requests_total = new client.Counter(
    {
      name: 'auth_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method'],
    });
    
    fastify.addHook('onResponse', (req, res, done) =>
    {
      auth_requests_total.inc({method: req.method});
      done();
    });
    
    // new client.Gauge({
    //   name: 'chat_activ_conn',
    //   help: 'active connextion on site',
    //   collect() {this.set(activeConn.size);},
    // });
    
    fastify.get('/metrics', async (request, reply) =>
    {
        reply
        .header('Content-Type', client.register.contentType)
        .send(await client.register.metrics());
    });
}
