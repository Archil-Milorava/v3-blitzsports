import 'dotenv/config'
import { MongoClient } from 'mongodb'
import { v4 as uuid } from 'uuid'
import { db } from '../drizzle'
// Fixed: Imported 'users' instead of 'user' to match your schema export
import { article, users } from '../drizzle/schema'

const mongo = new MongoClient(process.env.MONGO_URI!)

async function migrate() {
  await mongo.connect()
  const mongoDb = mongo.db('test') // Ensure 'test' is your actual MongoDB database name

  const mongoUsers = await mongoDb.collection('users').find().toArray()
  const mongoArticles = await mongoDb.collection('articles').find().toArray()

  console.log('Users:', mongoUsers.length)
  console.log('Articles:', mongoArticles.length)

  /* ---------------- ID MAP ---------------- */
  const userIdMap = new Map<string, string>()

  /* ---------------- USERS ---------------- */
  for (const u of mongoUsers) {
    const newId = uuid()
    userIdMap.set(u._id.toString(), newId)

    const createdAt = parseDate(u.createdAt)
    const updatedAt = parseDate(u.updatedAt)

    try {
      // Fixed: Using 'users' instead of 'user'
      await db.insert(users).values({
        id: newId,
        name: u.fullName,
        displayName: u.nickName ?? null,
        email: u.email,
        // Fixed: Mapped avatar to 'image' as defined in your Drizzle schema
        image: u.avatar ?? null,
        role: u.roles?.includes('admin') ? 'admin' : 'user',
        canEditUser: true,
        canMakeArticle: true,
        canMakeCard: true,
        createdAt,
        updatedAt,
      })
    } catch (e: any) {
      if (e.code === '23505') {
        // email already exists, skip
        console.log(`⚠️ Skipping user (duplicate email): ${u.email}`)
      } else {
        throw e
      }
    }
  }

  console.log('✅ Users migrated')

  /* ---------------- ARTICLES ---------------- */
  const usedSlugs = new Set<string>()

  for (const a of mongoArticles) {
    const authorUuid = userIdMap.get(a.author?.toString())
    if (!authorUuid) {
      console.log(`⚠️ Skipping article (author missing): ${a.title}`)
      continue
    }

    const createdAt = parseDate(a.createdAt)
    const updatedAt = parseDate(a.updatedAt)
    const slug = generateUniqueSlug(a.title, usedSlugs)

    try {
      await db.insert(article).values({
        id: uuid(),
        title: a.title,
        content: a.content,
        slug,
        coverImage: a.imageUrl,
        badge: a.badge ?? 'news',
        category: a.category ?? null,
        authorId: authorUuid,
        softDelete: false,
        createdAt,
        updatedAt,
      })
    } catch (e: any) {
      if (e.code === '23505') {
        console.log(`⚠️ Skipping article (duplicate slug): ${slug}`)
      } else {
        throw e
      }
    }
  }

  console.log('✅ Articles migrated')
  await mongo.close()
}

/* ---------------- HELPERS ---------------- */

// Safely parse MongoDB date to JS Date
function parseDate(d: any): Date {
  if (!d) return new Date()
  if (d.$date) return new Date(d.$date)
  if (typeof d === 'string' || d instanceof Date) {
    const dt = new Date(d)
    if (!isNaN(dt.getTime())) return dt
  }
  return new Date()
}

// Slug generator with uniqueness
function generateUniqueSlug(text: string, usedSlugs: Set<string>) {
  let base = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim()
    .replace(/\s+/g, '-')

  if (!base) base = 'article'

  let slug = base
  let counter = 1
  while (usedSlugs.has(slug)) {
    slug = `${base}-${counter}`
    counter++
  }
  usedSlugs.add(slug)
  return slug
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
