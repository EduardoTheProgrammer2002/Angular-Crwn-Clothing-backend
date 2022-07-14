const { Pool } = require('pg');

const localPoolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST
};

const prodPoolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
}

const poolConfig = process.env.DATABASE_URL ? prodPoolConfig : localPoolConfig;

const pool = new Pool(poolConfig);

module.exports = {pool};