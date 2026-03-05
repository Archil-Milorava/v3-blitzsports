import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../drizzle'
import { accounts, sessions, users, verifications } from '../drizzle/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      verification: verifications,
    },
  }),
  user: {
    additionalFields: {
      displayName: { type: 'string', required: false },
      role: { type: 'string', required: false, defaultValue: 'user' },
      canEditUser: { type: 'boolean', required: false, defaultValue: false },
      canMakeArticle: { type: 'boolean', required: false, defaultValue: false },
      canMakeCard: { type: 'boolean', required: false, defaultValue: false },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
