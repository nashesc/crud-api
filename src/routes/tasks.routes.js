import { Router } from 'express'
import * as service from '../services/tasks.service.js'

const router = Router()



router.get('/', async (req, res, next) => {
   try {
      res.json(await service.getAllTasks())
   } catch (error) {
      next(err)
   }
});

router.get('/:id', async (req, res, next) => {
   try {
      res.json(await service.getTaskById(Number(req.params.id)))
   } catch (err) {
      next(err)
   }
});

router.post('/', async (req, res, next) => {
   try {
      res.status(201).json(await service.createTask(req.body.title))
   } catch (err) {
      next(err)
   }
});

router.put('/:id', async (req, res, next) => {
   try {
      res.json(await service.updateTask(Number(req.params.id), req.body))
   } catch (err) {
      next(err)
   }
});

router.delete('/:id', async (req, res, next) => {
   try {
      await service.deleteTask(Number(req.params.id))
      res.status(204).send()
   } catch (err) {
      next(err)
   }
});

export default router;