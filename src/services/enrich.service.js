import { readFileSync, mkdirSync, appendFileSync } from 'fs'
import OpenAI from 'openai'
import { enrichInputSchema, enrichOutputSchema } from '../llm/schema.js'
import { ValidationError } from '../errors.js'

const client = new OpenAI({
   baseURL: process.env.LLM_BASE_URL,
   apiKey: process.env.LLM_API_KEY,
})

const SYSTEM_PROMPT = readFileSync(new URL('../../prompts/enrich-v1.md', import.meta.url), 'utf-8')
const PROMPT_VERSION = 'enrich-v1'

function extractJson(text) {
   const start = text.indexOf('{')
   const end = text.lastIndexOf('}')
   if (start === -1 || end === -1 || end < start) return null
   try {
      return JSON.parse(text.slice(start, end + 1))
   } catch {
      return null
   }
}

function quarantine(input, rawOutput, reason) {
   mkdirSync('logs', { recursive: true })
   appendFileSync('logs/quarantine.jsonl', JSON.stringify({
      timestamp: new Date().toISOString(),
      promptVersion: PROMPT_VERSION,
      input,
      rawOutput,
      reason
   }) + '\n')
}

async function callModel(input, repairContext) {
   const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: JSON.stringify(input) }
   ]
   if (repairContext) {
      messages.push({ role: 'assistant', content: repairContext.badOutput })
      messages.push({ role: 'user', content: `Your previous answer was rejected for this reason: ${repairContext.error}. Return only corrected JSON matching the schema.` })
   }
   const res = await client.chat.completions.create({
      model: process.env.LLM_MODEL,
      temperature: 0.2,
      messages
   })
   return res.choices[0].message.content
}

export async function runEnrich(input) {
   const parsedInput = enrichInputSchema.safeParse(input)
   if (!parsedInput.success) {
      const issue = parsedInput.error.issues[0]
      throw new ValidationError(`${issue.path.join('.')}: ${issue.message}`)
   }

   if (process.env.LLM_STUB === '1') {
      return {
         summary: "Stub summary — LLM_STUB is on, no model was called.",
         quality_flags: ["none"],
         confidence: 0.5
      }
   }

   const raw1 = await callModel(parsedInput.data)
   const json1 = extractJson(raw1)
   const check1 = json1 ? enrichOutputSchema.safeParse(json1) : null

   if (check1?.success) {
      return check1.data
   }

   const errorMsg = check1 ? check1.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') : 'response was not valid JSON'

   const raw2 = await callModel(parsedInput.data, { badOutput: raw1, error: errorMsg })
   const json2 = extractJson(raw2)
   const check2 = json2 ? enrichOutputSchema.safeParse(json2) : null

   if (check2?.success) {
      return check2.data
   }

   const finalError = check2 ? check2.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') : 'response was not valid JSON'
   quarantine(parsedInput.data, raw2, finalError)

   const err = new Error('Model could not produce a valid response after one repair attempt')
   err.status = 422
   throw err
}