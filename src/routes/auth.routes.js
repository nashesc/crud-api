import { Router } from 'express'
import * as authService from '../services/auth.service.js'

const router = Router()

router.post('/signup', async (req, res, next) => {
   try {
      const user = await authService.signUp(req.body.email, req.body.password)
      res.status(201).json(user)
   } catch (err) {
      next(err)
   }
})

router.post('/login', async (req, res, next) => {
   try {
      const result = await authService.logIn(req.body.email, req.body.password)
      res.status(200).json(result)
   } catch (err) {
      next(err)
   }
})

export default router