import Database from "better-sqlite3";

const db = new Database('tasks.db')

db.exec(`
   CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0)
   )
`)   

const { count } = db.prepare('SELECT COUNT(*) as count FROM tasks').get()

if (count === 0) {
   const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)')
   insert.run('Backend Track Assignments (Morning)', 1)
   insert.run('Work Tasks (Afternoon)', 1)
   insert.run('Dance Training (Night)', 0)
}

export default db