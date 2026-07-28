import { Router } from "express";
import supabase from '../supabaseClient.js'

const router = Router()

router.get('/profile', async (req, res, next) => {
   try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
         return res.status(401).json({ error: 'Access token required' })
      }

      const token = authHeader.split(' ')[1]
      const { data, error } = await supabase.auth.getUser(token)

      if (error) {
         return res.status(401).json({ error: 'Invalid or expired token' })
      }

      res.status(200).json({ 
         id: data.user.id, 
         email: data.user.email, 
         created_at: data.user.created_at
      })
   } catch (err) {
      next(err)
   }
})

export default router