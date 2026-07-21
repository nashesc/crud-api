let tasks = [
   { id: 1, title: "Backend Track Assignments (Morning)", done: true },
   { id: 2, title: "Work Tasks (Afternoon)", done: true },
   { id: 3, title: "Dance Training (Night)", done: false }
]

export function findAll() {
   return tasks;
}

export function findById(id) {
   return tasks.find(task => task.id === id);
}

export function create(title) {
   const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1, 
      title,
      done: false
   }
   tasks.push(newTask)
   return newTask
}

export function update(id, changes) {
   const task = tasks.find(t => t.id === id);
   if (!task) return undefined;

   if (changes.title !== undefined) {
      task.title = changes.title
   }
   if (changes.done !== undefined) {
      task.done = changes.done
   }
   return task;
}

export function remove(id) {
   const index = tasks.findIndex(task => task.id === id);
   if (index === -1) return false;
   tasks.splice(index, 1);
   return true;
}
