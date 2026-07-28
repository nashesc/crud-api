import supabase from "../supabaseClient.js"

export async function requireAuth(req, res, next) {
   const authHeader = req.headers.authorization

   if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
      return res.status(401).json({ error: 'Access token required' })
   }

   const token = authHeader.split(' ')[1]
   const { data, error } = await supabase.auth.getUser(token)

   if (error) {
      return res.status(401).json({ error: 'Invalid or expired token' })
   }

   req.user = data.user
   req.token = token
   next()
}