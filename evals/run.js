import { readFileSync } from 'fs'

const BASE_URL = process.env.EVAL_BASE_URL || 'http://localhost:3000'
const cases = JSON.parse(readFileSync(new URL('./cases.json', import.meta.url), 'utf-8'))

function sortedFlags(arr) {
   return [...arr].sort().join(',')
}

function flagsMatchAny(actual, acceptableSets) {
   const actualSorted = sortedFlags(actual)
   return acceptableSets.some(set => sortedFlags(set) === actualSorted)
}

async function runCase(c) {
   const res = await fetch(`${BASE_URL}/enrich`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c.input)
   })

   if (!res.ok) {
      return { id: c.id, pass: false, error: `HTTP ${res.status}`, body: await res.text() }
   }

   const body = await res.json()

   const flagsOk = flagsMatchAny(body.quality_flags, c.expected.acceptable_quality_flags)
   const confOk = body.confidence >= c.expected.confidence_min && body.confidence <= c.expected.confidence_max
   const verbatim = body.summary.trim().toLowerCase() === c.input.description.trim().toLowerCase()
   const notVerbatimOk = !verbatim

   return {
      id: c.id,
      pass: flagsOk && confOk && notVerbatimOk,
      flagsOk,
      confOk,
      notVerbatimOk,
      actual: body,
      expected: c.expected
   }
}

function sleep(ms) {
   return new Promise(r => setTimeout(r, ms))
}

async function main() {
   const results = []
   for (const c of cases) {
      const r = await runCase(c)
      results.push(r)
      console.log(`[${r.pass ? 'PASS' : 'FAIL'}] ${r.id}`)
      if (!r.pass) {
         console.log(`   flags: ${JSON.stringify(r.actual?.quality_flags)} vs expected one of ${JSON.stringify(r.expected?.acceptable_quality_flags)} -> ${r.flagsOk ? 'ok' : 'MISMATCH'}`)
         console.log(`   confidence: ${r.actual?.confidence} vs expected ${r.expected?.confidence_min}-${r.expected?.confidence_max} -> ${r.confOk ? 'ok' : 'MISMATCH'}`)
         console.log(`   verbatim copy check: ${r.notVerbatimOk ? 'ok' : 'FAIL — summary is a verbatim copy of description'}`)
         if (r.error) console.log(`   error: ${r.error} ${r.body ?? ''}`)
      }
      await sleep(500)
   }
   console.log(`\nScore: ${results.filter(r => r.pass).length}/${results.length}`)
}

main()