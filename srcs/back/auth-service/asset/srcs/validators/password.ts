function validatePassword(request, reply, done) {
    let { password } = request.body;
    password = (password as string);
    if (!password || password.length < 8)
      return reply.code(400).send({ error: 'password_too_short' });
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
        return reply.code(400).send({ error: 'password_no_uppercase_char' });
    if (!hasLowerCase)
        return reply.code(400).send({ error: 'password_no_lowercase_char' });
    if (!hasDigit)
        return reply.code(400).send({ error: 'password_no_digit' }); 
    done();
}

module.exports = validatePassword;