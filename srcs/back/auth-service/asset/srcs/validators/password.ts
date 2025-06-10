export default function validatePassword(request: any, reply: any, done: any) {
    let { password } = request.body;
    password = (password as string);
    if (!password || password.length < 8)
      return reply.code(230).send({ error: '1002' });
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasDigit = false;
  
    for (let i = 0; i < password.length; i++) {
      const c = password[i];
  
      if (c >= 'A' && c <= 'Z') {
        hasUpperCase = true;
      } else if (c >= 'a' && c <= 'z') {
        hasLowerCase = true;
      } else if (c >= '0' && c <= '9') {
        hasDigit = true;
      }
    }
  
    if (!hasUpperCase)
        return reply.code(230).send({ error: '1001' });
    if (!hasLowerCase)
        return reply.code(230).send({ error: '1001' });
    if (!hasDigit)
        return reply.code(230).send({ error: '1001' }); 
    done();
}