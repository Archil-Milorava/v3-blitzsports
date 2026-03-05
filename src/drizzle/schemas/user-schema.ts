import { relations } from 'drizzle-orm'
import { boolean, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { article } from './article-schema'

export const roleEnum = pgEnum('role_enum', ['admin', 'writer', 'user'])

export const users = pgTable('users', {
  id: text('id').primaryKey(), 
  name: text('name').notNull(),
  displayName: text('displayName'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false), 
  password: text('password'),
  image: text('image'), 
  role: roleEnum('role').default('user').notNull(),
  canEditUser: boolean('canEditUser').default(false).notNull(),
  canMakeArticle: boolean('canMakeArticle').default(false).notNull(),
  canMakeCard: boolean('canMakeCard').default(false).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull()
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => users.id, { onDelete: 'cascade' })
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt")
});

export const userRelations = relations(users, ({ many }) => ({
  articles: many(article),
}))