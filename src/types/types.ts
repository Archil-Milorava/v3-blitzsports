import { InferSelectModel } from 'drizzle-orm'
import { article } from '../drizzle/schema'

export type Article = InferSelectModel<typeof article>
