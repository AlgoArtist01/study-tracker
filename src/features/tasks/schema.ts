import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, 'Title required').max(120),
  description: z.string().max(1000).optional(),
  duration: z.coerce.number().min(0).max(1440).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
  tags: z.string().optional(),
})

export type TaskFormInput = z.input<typeof taskSchema>
export type TaskFormOutput = z.output<typeof taskSchema>