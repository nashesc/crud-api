import { Router } from "express";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router()

router.get('/profile', requireAuth, (req, res) => {
   res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      created_at: req.user.created_at
   })
})

router.get('/dashboard', requireAuth, (req, res) => {
   res.status(200).json({ message: `Welcome to your dashboard, ${req.user.email}` })
})

export default router