import { ValidationError, NotFoundError, AuthError } from '../errors.js'

export function errorHandler(err, req, res, next) {
   if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message })
   }
   if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message })
   }
   if (err instanceof AuthError) {
      return res.status(401).json({ error: err.message })
   }
   if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON in request body' })
   }
   console.error(err)
   res.status(500).json({ error: "Internal Server Error" })
}