import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Plus, X } from 'lucide-react'
import { format } from 'date-fns'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { topicSchema, type TopicFormInput, type TopicFormOutput } from './schema'
import { PRIORITY_OPTIONS, DIFFICULTY_OPTIONS, STATUS_OPTIONS, STATUS_LABEL } from './constants'
import { createTopic, updateTopic } from '@/db/topics'
import type { Topic } from '@/types/models'

interface Props {
    categoryId: string
    topic?: Topic
    trigger: React.ReactElement
}

export function TopicFormDialog({ categoryId, topic, trigger }: Props) {
    const [open, setOpen] = useState(false)

    function defaults(): TopicFormInput {
        return {
            name: topic?.name ?? '',
            notes: topic?.notes ?? '',
            priority: topic?.priority ?? 'medium',
            difficulty: topic?.difficulty ?? 'medium',
            estimatedHours: topic?.estimatedHours ?? 1,
            status: topic?.status ?? 'not_started',
            targetDate: topic?.targetDate ? format(new Date(topic.targetDate), 'yyyy-MM-dd') : '',
            tags: topic?.tags.join(', ') ?? '',
            resources: topic?.resources ?? [],
        }
    }

    const {
        register, handleSubmit, control, reset, formState: { errors, isSubmitting },
    } = useForm<TopicFormInput, unknown, TopicFormOutput>({
        resolver: zodResolver(topicSchema),
        defaultValues: defaults(),
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'resources' })

    useEffect(() => {
        if (open) reset(defaults())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, topic])

    async function onSubmit(values: TopicFormOutput) {
        try {
            const payload = {
                categoryId,
                name: values.name,
                notes: values.notes,
                priority: values.priority,
                difficulty: values.difficulty,
                estimatedHours: values.estimatedHours,
                status: values.status,
                targetDate: values.targetDate ? new Date(values.targetDate).getTime() : undefined,
                tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
                resources: values.resources,
            }
            if (topic) {
                await updateTopic(topic.id, payload)
                toast.success('Topic updated')
            } else {
                await createTopic(payload)
                toast.success('Topic created')
            }
            setOpen(false)
        } catch {
            toast.error('Something went wrong')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={trigger} />
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{topic ? 'Edit topic' : 'New topic'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register('name')} placeholder="e.g. Binary Search Trees" />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" {...register('notes')} rows={3} placeholder="Optional" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Controller
                                control={control}
                                name="priority"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {PRIORITY_OPTIONS.map((p) => (
                                                <SelectItem key={p} value={p}>{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <Controller
                                control={control}
                                name="difficulty"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {DIFFICULTY_OPTIONS.map((d) => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="estimatedHours">Estimated hours</Label>
                            <Input id="estimatedHours" type="number" step="0.5" min="0" {...register('estimatedHours')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="targetDate">Target date</Label>
                            <Input id="targetDate" type="date" {...register('targetDate')} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map((s) => (
                                            <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input id="tags" {...register('tags')} placeholder="comma, separated, tags" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Resources</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={() => append({ label: '', url: '' })}>
                                <Plus className="mr-1 h-3 w-3" /> Add
                            </Button>
                        </div>
                        {fields.map((field, i) => (
                            <div key={field.id} className="flex gap-2">
                                <Input placeholder="Label" {...register(`resources.${i}.label`)} />
                                <Input placeholder="https://..." {...register(`resources.${i}.url`)} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {topic ? 'Save changes' : 'Create topic'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}