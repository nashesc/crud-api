import { enrichInputSchema } from '../llm/schema.js'
import { ValidationError } from '../errors.js'

export async function runEnrich(input) {
   const parsed = enrichInputSchema.safeParse(input)
   if (!parsed.success) {
      const issue = parsed.error.issues[0]
      throw new ValidationError(`${issue.path.join('.')}: ${issue.message}`)
   }

   if (process.env.LLM_STUB === '1') {
      return {
         summary: "Stub summary — LLM_STUB is on, no model was called.",
         quality_flags: ["none"],
         confidence: 0.5
      }
   }

   const err = new Error('Model call not implemented until Stage 2')
   err.status = 501
   throw err
}