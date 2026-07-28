import { Router } from 'express'
import * as authService from '../services/auth.service.js'
import { requireAuth } from '../middleware/require-auth.js'

const router = Router()

router.post('/logout', requireAuth, async (req, res, next) => {
   try {
      await authService.logOut(req.token)
      res.status(204).send()
   } catch (err) {
      next(err)
   }
})

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