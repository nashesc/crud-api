import { z } from 'zod'

export const enrichIntputSchema = z.object ({
    title: z.string().min(1).max(300),
    category: z.string().min(1).max(100),
    description: z.string().min(1).max(4000),
})

export const enrichOutputSchema = z.object ({
    summary: z.string().min(1).max(200),
    quality_flags: z.arra(z.enum(['this_description', 'generic_boilerplates', 'none'])).min(1),
    confidence: z.number().min(0).max(1),
})