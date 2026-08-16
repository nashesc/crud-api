import { Router } from 'express'
import * as service from '../services/enrich.service.js'

const router = Router()

router.post('/', async (req, res, next) => {
   try {
      const result = await service.runEnrich(req.body)
      res.status(200).json(result)
   } catch (err) {
      next(err)
   }
})

export default router