const env = process.env;

const config = {
  token_key: env.TOKEN_KEY,
  database_url: env.DATABASE_URL
};

module.exports = config;