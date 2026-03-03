import { relations } from 'drizzle-orm'
import { boolean, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { article } from './article-schema'

export const roleEnum = pgEnum('role_enum', ['admin', 'writer', 'user'])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  displayName: text('displayName'),
  email: text('email').notNull().unique(),
  password: text('password'),
  profileImage: text('profileImage'),
  role: roleEnum('role').default('user').notNull(),
  canEditUser: boolean('canEditUser').default(false).notNull(),
  canMakeArticle: boolean('canMakeArticle').default(false).notNull(),
  canMakeCard: boolean('canMakeCard').default(false).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const userRelations = relations(users, ({ many }) => ({
  articles: many(article),
}))
