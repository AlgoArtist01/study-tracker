import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Name required').max(50),
  color: z.string().min(1),
  icon: z.string().min(1),
  description: z.string().max(200).optional(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>