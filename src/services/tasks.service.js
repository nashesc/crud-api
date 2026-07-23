import * as repo from '../repositories/tasks.repository.js';
import { ValidationError, NotFoundError } from '../errors.js';

export async function getAllTasks() {
   return repo.findAll();
}

export async function getTaskById(id) {
   const task = await repo.findById(id);
   if (!task) {
      throw new NotFoundError(`Task ${id} not found`);
   }
   return task;
}

export function createTask(title) {
   if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new ValidationError('Title is required')
   }
   return repo.create(title)
}

export function updateTask(id, { title, done }) {
   const existing = repo.findById(id)
   if (!existing) {
      throw new NotFoundError(`Task ${id} not found`)
   }

   if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      throw new ValidationError('Title cannot be empty')
   }

   return repo.update(id, { title, done })
}

export function deleteTask(id) {
   const existing = repo.findById(id)
   if (!existing) {
      throw new NotFoundError(`Task ${id} not found`)
   }
   repo.remove(id)
}