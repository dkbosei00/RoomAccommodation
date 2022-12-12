const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, "../../.env")})

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    url: "postgres://ztwqnuyp:dJpZpKCK0dVuJ6TEpAi_1gtXVmOB2RkY@lallah.db.elephantsql.com/ztwqnuyp",
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
}
