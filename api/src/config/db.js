import pg from 'pg'

const { Pool } = pg

// Connection details come from environment variables set in docker-compose.yml,
// which in turn pull from the project-root .env file. DB_HOST is "postgres" -
// the service name in docker-compose - not "localhost", since this container
// talks to the postgres container over the internal streaming-net network.
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})