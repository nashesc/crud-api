import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tasks = [
   { id: 1, title: "Backend Track Assignment 1 (Morning)", done: true },
   { id: 2, title: "Work Tasks (Afternoon)", done: true },
   { id: 3, title: "Dance Training (Night)", done: false }
];

app.get('/', (req, res) => {
   res.json({
      name: "Task API",
      version: "1.0",
      endpoints: ["/tasks"]
   })
});

app.get('/health', (req, res) => {
   res.json({ status: "ok" });
});

app.get('/tasks', (req, res) => {
   res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
   const id = Number(req.params.id);
   const task = tasks.find(task => task.id === id)

   if (!task) {
      return res.status(404).json({ error: `Task ${id} not found` })
   }

   res.json(task);
});

app.post('/tasks', (req, res) => {
   const { title } = req.body;

   if (!title || title.trim() === '') {
      return res.status(400).json({ error: "Title is required" });
   }

   const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1, 
      title,
      done: false
   }
   
   tasks.push(newTask)
   res.status(201).json(newTask)
});

app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
})