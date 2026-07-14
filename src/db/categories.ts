import { db } from './db'
import type { Category } from '@/types/models'

export async function createCategory(data: Omit<Category, 'id' | 'order' | 'createdAt' | 'updatedAt'>) {
  const count = await db.categories.count()
  const now = Date.now()
  const category: Category = {
    ...data,
    id: crypto.randomUUID(),
    order: count,
    createdAt: now,
    updatedAt: now,
  }
  await db.categories.add(category)
  return category
}

export async function updateCategory(id: string, changes: Partial<Category>) {
  await db.categories.update(id, { ...changes, updatedAt: Date.now() })
}

export async function deleteCategory(id: string) {
  await db.categories.delete(id)
  // cascade: delete topics/tasks under this category
  const topics = await db.topics.where('categoryId').equals(id).toArray()
  await db.topics.bulkDelete(topics.map(t => t.id))
  await db.tasks.where('categoryId').equals(id).delete()
}

export async function reorderCategories(orderedIds: string[]) {
  await db.transaction('rw', db.categories, async () => {
    await Promise.all(orderedIds.map((id, i) => db.categories.update(id, { order: i })))
  })
}