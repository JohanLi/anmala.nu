require('dotenv').config({ path: './.env.local' })
const { Pool } = require('pg');

const db = new Pool({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: 'postgres',
});

const main = async () => {
  const result = await db.query(`
    SELECT id
    FROM users
    WHERE email = $1
  `, ['test@example.com']);

  const { id } = result.rows[0] || {};

  if (!id) {
    process.exit(0);
  }

  await db.query(`
    DELETE FROM sessions
    WHERE user_id = $1
  `, [id]);

  await db.query(`
    DELETE FROM pages
    WHERE user_id = $1
  `, [id]);

  await db.query(`
    DELETE FROM users
    WHERE id = $1
  `, [id]);

  process.exit(0);
}

main();
