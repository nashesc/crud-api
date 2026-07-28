import { Router } from "express";

const router = Router()

router.get('/profile', (req, res) => {
   const authHeader = req.headers.authorization

   if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
      return res.status(401).json({ error: 'Access token required' })
   }

   res.status(200).json({ message: 'Token present, not yet verified' })
})

export default router