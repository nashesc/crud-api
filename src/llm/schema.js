import { z } from 'zod'

export const enrichInputSchema = z.object({
    title: z.string().min(1).max(300),
    category: z.string().min(1).max(100),
    description: z.string().min(1).max(4000)
})

export const enrichOutputSchema = z.object({
    summary: z.string().min(1).max(200),
    quality_flags: z.array(z.enum(['thin_description', 'generic_boilerplate', 'none'])).min(1),
    confidence: z.number().min(0).max(1)
}).refine(
   d => !(d.quality_flags.includes('none') && d.quality_flags.length > 1),
   { message: "'none' cannot appear with other flags", path: ['quality_flags'] }
).refine(
   d => new Set(d.quality_flags).size === d.quality_flags.length,
   { message: "duplicate flags not allowed", path: ['quality_flags'] }
)