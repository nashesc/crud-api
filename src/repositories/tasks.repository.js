import db from "../db.js"

function rowToTask(row) {
   if (!row) return undefined
   return {
      id: row.id,
      title: row.title,
      done: !!row.done
   }
}

export function findAll() {
   return db.prepare('SELECT * FROM tasks').all().map(rowToTask)
}

export function findById(id) {
   return rowToTask(db.prepare('SELECT * FROM tasks WHERE id = ?').get(id))
}

export function create(title) {
   const info = db.prepare('INSERT INTO tasks (title, done) VALUES (?, 0)').run(title)
   return findById(info.lastInsertRowid)
}

export function update(id, changes) {
   const existing = findById(id)
   if (!existing) return undefined

   const title = changes.title !== undefined ? changes.title : existing.title
   const done = changes.done !== undefined ? changes.done : existing.done

   db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?')
     .run(title, done ? 1 : 0, id)

   return findById(id)
}

export function remove(id) {
   const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
   return info.changes > 0
}
