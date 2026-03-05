import { relations } from 'drizzle-orm'
import { boolean, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './user-schema'

export const badgeEnum = pgEnum('badge_enum', ['news', 'history'])

export const article = pgTable('article', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').unique().notNull(),
  coverImage: text('coverImage').notNull(),
  badge: badgeEnum('badge').default('news'),
  category: text('category'),
  authorId: text('authorId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  softDelete: boolean('softDelete').default(false),
  deletedAt: timestamp('deletedAt'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const articleRelations = relations(article, ({ one }) => ({
  author: one(users, {
    fields: [article.authorId],
    references: [users.id],
  }),
}))
