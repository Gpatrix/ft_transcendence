import fastify from 'fastify'
import path from 'node:path'
import multipartPlugin from '@fastify/multipart'
import cookiesPlugin from '@fastify/cookie';
import staticPlugin from '@fastify/static'
import { metrics , upload_requests_total} from './metrics'
import uploadRoutes from './routes/upload'

const server = fastify();

server.register(staticPlugin, {
  root: path.join(__dirname, '../uploads'),
  prefix: '/api/upload/'
})

server.register(cookiesPlugin, {});

server.addHook('onResponse', (req, res, done) =>
  {
    upload_requests_total.inc({method: req.method});
    done();
});

server.register(multipartPlugin, {
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 100,     // Max field value size in bytes
    fields: 10,         // Max number of non-file fields
    fileSize: 1000000 * 500,  // For multipart forms, the max file size in bytes
    files: 1,           // Max number of file fields
    headerPairs: 2000,  // Max number of header key=>value pairs
    parts: 1000         // For multipart forms, the max number of parts (fields + files)
  }
});

server.register(metrics);

server.register(uploadRoutes, { config: {
  max: 5,
  timeWindow: '1 minute'
}});

server.listen({ host: '0.0.0.0', port: 3000 }, (err) =>
{
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`ready`);
});