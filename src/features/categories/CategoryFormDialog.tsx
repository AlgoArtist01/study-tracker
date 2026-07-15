import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { categorySchema, type CategoryFormValues } from './schema'
import { CATEGORY_ICONS, CATEGORY_COLORS } from './constants'
import { createCategory, updateCategory } from '@/db/categories'
import type { Category } from '@/types/models'

interface Props {
  category?: Category
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CategoryFormDialog({ category, trigger, open: controlledOpen, onOpenChange }: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const {
    register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? '',
      color: category?.color ?? CATEGORY_COLORS[0],
      icon: category?.icon ?? 'book',
      description: category?.description ?? '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? '',
        color: category?.color ?? CATEGORY_COLORS[0],
        icon: category?.icon ?? 'book',
        description: category?.description ?? '',
      })
    }
  }, [open, category, reset])

  const selectedColor = watch('color')
  const selectedIcon = watch('icon')

  async function onSubmit(values: CategoryFormValues) {
    try {
      if (category) {
        await updateCategory(category.id, values)
        toast.success('Category updated')
      } else {
        await createCategory(values)
        toast.success('Category created')
      }
      setOpen(false)
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit category' : 'New category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} placeholder="e.g. Data Structures" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="Optional" rows={2} />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue('color', c)}
                  className={cn(
                    'h-7 w-7 rounded-full ring-offset-2 ring-offset-background transition',
                    selectedColor === c && 'ring-2 ring-foreground'
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_ICONS).map(([key, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue('icon', key)}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-md border transition',
                    selectedIcon === key ? 'border-foreground bg-accent' : 'border-border'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {category ? 'Save changes' : 'Create category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}