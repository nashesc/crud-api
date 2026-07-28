import supabase from "../supabaseClient.js"
import { AuthError } from "../errors.js"

export async function requireAuth(req, res, next) {
   const authHeader = req.headers.authorization

   if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
      throw new AuthError('Access token required')
   }

   const token = authHeader.split(' ')[1]
   const { data, error } = await supabase.auth.getUser(token)

   if (error) {
      throw new AuthError('Invalid or expired token')
   }

   req.user = data.user
   req.token = token
   next()
}