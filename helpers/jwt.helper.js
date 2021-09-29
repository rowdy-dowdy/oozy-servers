const jwt = require('jsonwebtoken')
const env = process.env;

async function verityToken(token) {
  const decode = await jwt.verify(token, env.TOKEN_KEY);
  
  return decode;
}

async function createToken(user) {
  if (!user) throw 'Username or password is incorrect';

  const token = await jwt.sign(user, env.TOKEN_KEY);

  return token;
}

module.exports = {
  verityToken,
  createToken
};