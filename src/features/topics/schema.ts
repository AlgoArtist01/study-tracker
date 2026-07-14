import { z } from 'zod'

export const topicSchema = z.object({
  name: z.string().min(1, 'Name required').max(80),
  notes: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedHours: z.coerce.number().min(0).max(1000),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  targetDate: z.string().optional(),
  tags: z.string().optional(),
  resources: z.array(z.object({
    label: z.string().min(1, 'Label required'),
    url: z.string().url('Must be a valid URL'),
  })).default([]),
})

export type TopicFormInput = z.input<typeof topicSchema>
export type TopicFormOutput = z.output<typeof topicSchema>