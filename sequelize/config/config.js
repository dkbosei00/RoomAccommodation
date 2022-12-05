const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, "../../.env")})

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    host: "127.0.0.1",
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
}
