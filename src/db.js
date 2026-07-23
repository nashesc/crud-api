import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const pool = new Pool({
   connectionString: process.env.DATABASE_URL
})

async function init() {
   await pool.query (`
      CREATE TABLE IF NOT EXISTS tasks (
         id SERIAL PRIMARY KEY,
         title TEXT NOT NULL,
         done BOOLEAN NOT NULL DEFAULT false
      )
   `)   

   const { rows } = await pool.query('SELECT COUNT(*) AS count FROM tasks')

   if (Number(rows[0].count) === 0) {
      await pool.query(
         'INSERT INTO tasks (title, done) VALUES ($1, $2), ($3, $4), ($5, $6)',
         [
            'Backend Track Assignments (Morning)', true,
            'Work Tasks (Afternoon)', true,
            'Dance Training (Night)', false
         ]
      )
   }
}

await init()



export default pool