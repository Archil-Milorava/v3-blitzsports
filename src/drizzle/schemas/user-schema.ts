import { relations } from 'drizzle-orm'
import { boolean, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role_enum', ['admin', 'writer', 'user'])

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  displayName: text('displayName'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  profileImage: text('profileImage'),
  role: roleEnum('role').default('user').notNull(),
  canEditUser: boolean('canEditUser').default(false),
  canMakeArticle: boolean('canMakeArticle').default(false),
  canMakeCard: boolean('canMakeCard').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const userRelations = relations(user, ({ many }) => ({}))
