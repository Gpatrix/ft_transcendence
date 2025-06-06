import fastify from 'fastify'
import cookiesPlugin from '@fastify/cookie';
import multipartPlugin from '@fastify/multipart';
import public_userRoutes from "./routes/public_user";
import private_userRoutes from "./routes/private_user";
import friendsRoutes from "./routes/friends";
import { metrics , user_requests_total} from './metrics'

const server = fastify();

server.addHook('onResponse', (req, res, done) =>
{
	user_requests_total.inc({method: req.method});
	done();
});

server.register(multipartPlugin, {
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 100,     // Max field value size in bytes
    fields: 10,         // Max number of non-file fields
    fileSize: 1050000,  // For multipart forms, the max file size in bytes
    files: 1,           // Max number of file fields
    headerPairs: 2000,  // Max number of header key=>value pairs
    parts: 1000         // For multipart forms, the max number of parts (fields + files)
  }
});
server.register(cookiesPlugin, {});
server.register(metrics);
server.register(public_userRoutes);
server.register(private_userRoutes);
server.register(friendsRoutes);

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) =>
{
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`ready`);
})