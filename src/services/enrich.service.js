import { readFileSync } from 'fs'
import OpenAI from 'openai'
import { enrichInputSchema } from '../llm/schema.js'
import { ValidationError } from '../errors.js'

const client = new OpenAI({
   baseURL: process.env.LLM_BASE_URL,
   apiKey: process.env.LLM_API_KEY,
})

const SYSTEM_PROMPT = readFileSync(new URL('../../prompts/enrich-v1.md', import.meta.url), 'utf-8')

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
   
   const res = await client.chat.completions.create({
      model: process.env.LLM_MODEL,
      temperature: 0.2,
      messages: [
         { role: 'system', content: SYSTEM_PROMPT },
         { role: 'user', content: JSON.stringify(parsed.data) }
      ]
   })

   return res.choices[0].message.content
}