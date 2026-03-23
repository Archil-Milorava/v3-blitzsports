import { InferSelectModel } from 'drizzle-orm'
import { article, users } from '../drizzle/schema'

export type Article = InferSelectModel<typeof article>
export type User = InferSelectModel<typeof users>
