'use server'
import cloudinary from '@/src/config/cloudinary'
import { db } from '@/src/drizzle'
import { article } from '@/src/drizzle/schema'
import { publicUserSelect } from '@/src/drizzle/selects'
import { and, count, desc, eq } from 'drizzle-orm'

export const getLandingNews = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 60000))
  const landingNews = await db.query.article.findMany({
    where: and(eq(article.badge, 'news'), eq(article.softDelete, false)),
    orderBy: [desc(article.createdAt)],
    limit: 6,
  })

  if (!landingNews) throw new Error('Articles not found')

  return landingNews
}

export const getLandingHistories = async () => {
  // await new Promise((res) => setTimeout(res, 15000))
  const landingHistories = await db.query.article.findMany({
    where: and(eq(article.badge, 'history'), eq(article.softDelete, false)),
    orderBy: [desc(article.createdAt)],
    limit: 3,
  })

  if (!landingHistories) throw new Error('Histories not found')

  return landingHistories
}

export const getNewsByCategory = async (category: string, page: number = 1) => {
  const limit = 6
  const offset = (page - 1) * limit

  const articles = await db.query.article.findMany({
    where: (article, { eq, and }) =>
      and(eq(article.category, category), eq(article.softDelete, false)),
    orderBy: (article, { desc }) => [desc(article.createdAt)],
    limit: limit,
    offset: offset,
  })

  const totalArticles = await db
    .select({ count: count() })
    .from(article)
    .where(and(eq(article.category, category), eq(article.softDelete, false)))

  return {
    articles,
    totalPages: Math.ceil(totalArticles[0].count / limit),
  }
}

export const getArticle = async (articleSlug: string) => {
  const articleBySlug = await db.query.article.findFirst({
    where: eq(article.slug, articleSlug),
    with: {
      author: {
        columns: publicUserSelect,
      },
    },
  })

  if (!articleBySlug) throw new Error('Article not found')

  return articleBySlug
}

export const getArticleByUserId = async (userId: string, page: number = 1) => {
  const limit = 10
  const offset = (page - 1) * limit

  const articles = await db.query.article.findMany({
    where: (article, { eq, and }) =>
      and(eq(article.authorId, userId), eq(article.softDelete, false)),
    orderBy: (article, { desc }) => [desc(article.createdAt)],
    limit: limit,
    offset: offset,
  })

  if (!articles) throw new Error('News not found')

  return articles
}

export const getArticlesByUserIdPaginated = async (userId: string, page: number = 1) => {
  const limit = 10
  const offset = (page - 1) * limit

  // 1. Fetch the articles for the current page
  const articles = await db.query.article.findMany({
    where: (article, { eq, and }) =>
      and(eq(article.authorId, userId), eq(article.softDelete, false)),
    with: {
      author: {
        columns: publicUserSelect,
      },
    },
    orderBy: (article, { desc }) => [desc(article.createdAt)],
    limit: limit,
    offset: offset,
  })

  // 2. Fetch the total count to calculate pagination
  const [totalResult] = await db
    .select({ total: count() })
    .from(article)
    .where(and(eq(article.authorId, userId), eq(article.softDelete, false)))

  const totalPages = Math.ceil(totalResult.total / limit)

  return {
    articles,
    totalPages,
    currentPage: page,
  }
}

export const softDeleteArticle = async (articleId: string) => {
  if (!articleId) {
    throw new Error('please provide article id')
  }

  const result = await db
    .update(article)
    .set({
      softDelete: true,
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(article.id, articleId))
    .returning()

  console.log(result)

  return result[0]
}

export const createArticle = async (values: any, authorId: string) => {
  let imageUrl = ''

  if (values.image) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(values.image, {
        folder: 'articles',
      })
      imageUrl = uploadResponse.secure_url
    } catch (err) {
      console.error('Cloudinary Error:', err)
      throw new Error('სურათის ატვირთვა ვერ მოხერხდა')
    }
  }

  const slug =
    values.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now()}`

  await db.insert(article).values({
    title: values.title,
    content: values.content,
    coverImage: imageUrl,
    badge: values.badge,
    category: values.category,
    authorId: authorId,
    slug: slug,
  })

  return { success: true }
}

export const updateArticle = async (slug: string, values: any) => {
  let imageUrl = values.image

  // If the image starts with "data:image", it's a new Base64 string from the client
  if (values.image && values.image.startsWith('data:image')) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(values.image, {
        folder: 'articles',
      })
      imageUrl = uploadResponse.secure_url
    } catch (err) {
      console.error('Cloudinary Error:', err)
      throw new Error('სურათის განახლება ვერ მოხერხდა')
    }
  }

  const result = await db
    .update(article)
    .set({
      title: values.title,
      content: values.content,
      coverImage: imageUrl,
      badge: values.badge,
      category: values.category,
      updatedAt: new Date(),
    })
    .where(eq(article.slug, slug))
    .returning()

  return result[0]
}
