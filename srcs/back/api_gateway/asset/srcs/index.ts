import fastify from 'fastify'
import jwt from 'jsonwebtoken'

const server = fastify();
const authServiceAddress = "http://auth-service:3001";

server.post('/api/user/login', async (req, res) => {
  const response = await fetch(`${authServiceAddress}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.status(response.status).send(data);
});

server.post('/api/user/signin', async (req, res) => {
  const response = await fetch(`${authServiceAddress}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.status(response.status).send(data);
});

server.delete('/api/user/logout', async (req, res) => {
  const response = await fetch(`${authServiceAddress}/logout`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.status(response.status).send(data);
});

interface getUserParams {
  id: string
}

server.delete<{ Params: getUserParams }>('/api/user/search/:id', async (req, res) => {
  const response = await fetch(`${authServiceAddress}/search/${req.params.id}`, { method: 'GET' });
  const data = await response.json();
  res.status(response.status).send(data);
});


async function main() {
  let _address;
  await server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    _address = address;
    console.log(`Server listening at ${_address}`);
  })
}

main();

