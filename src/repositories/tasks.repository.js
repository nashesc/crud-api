import pool from "../db.js"

function rowToTask(row) {
   if (!row) return undefined
   return {
      id: row.id,
      title: row.title,
      done: row.done
   }
}

export async function findAll() {
   const { rows } = await pool.query('SELECT * FROM tasks')
   return rows.map(rowToTask)
}

export async function findById(id) {
   const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id])
   return rowToTask(rows[0])
}

export async function create(title) {
   const { rows } = await pool.query(
      'INSERT INTO tasks (title, done) VALUES ($1, false) RETURNING *',
      [title]
   )
   return rowToTask(rows[0])
}

export async function update(id, changes) {
   const existing = await findById(id)
   if (!existing) return undefined

   const title = changes.title !== undefined ? changes.title : existing.title
   const done = changes.done !== undefined ? changes.done : existing.done

   const { rows } = await pool.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
      [title, done, id]
   )
   return rowToTask(rows[0])
}

export async function remove(id) {
   const { rowCount } = await pool.query(
      'DELETE FROM tasks WHERE id = $1', 
      [id]
   )
   return rowCount > 0
}
