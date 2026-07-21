import { Router } from 'express'
import * as service from '../services/tasks.service.js'

const router = Router()



router.get('/', (req, res) => {
   res.json(service.getAllTasks())
});

router.get('/:id', (req, res, next) => {
   try {
      res.json(service.getTaskById(Number(req.params.id)))
   } catch (err) {
      next(err)
   }
});

router.post('/', (req, res, next) => {
   try {
      res.status(201).json(service.createTask(req.body.title))
   } catch (err) {
      next(err)
   }
});

router.put('/:id', (req, res, next) => {
   try {
      res.json(service.updateTask(Number(req.params.id), req.body))
   } catch (err) {
      next(err)
   }
});

router.delete('/:id', (req, res, next) => {
   try {
      service.deleteTask(Number(req.params.id))
      res.status(204).send()
   } catch (err) {
      next(err)
   }
});

export default router;