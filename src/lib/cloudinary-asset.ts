import cloudinary from '@/src/config/cloudinary'

/**
 * Derives Cloudinary `public_id` from a typical `res.cloudinary.com` delivery URL.
 * Handles optional transformation segments and optional `v123` version prefix.
 */
export function publicIdFromCloudinaryUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null
  if (!url.includes('res.cloudinary.com')) return null

  try {
    const pathname = new URL(url).pathname
    const key = '/upload/'
    const uploadIdx = pathname.indexOf(key)
    if (uploadIdx === -1) return null

    const rest = pathname.slice(uploadIdx + key.length)
    const segments = rest.split('/').filter(Boolean)
    let i = 0

    while (i < segments.length) {
      const seg = segments[i]
      if (seg.includes(',')) {
        i++
        continue
      }
      if (/^v\d+$/i.test(seg)) {
        i++
        break
      }
      break
    }

    const publicIdParts = segments.slice(i)
    if (publicIdParts.length === 0) return null

    let publicId = decodeURIComponent(publicIdParts.join('/'))
    publicId = publicId.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, '')
    return publicId || null
  } catch {
    return null
  }
}

export async function destroyCloudinaryImageByUrl(url: string | null | undefined): Promise<void> {
  const publicId = publicIdFromCloudinaryUrl(url)
  if (!publicId) return

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
    if (result.result !== 'ok' && result.result !== 'not found') {
      console.warn('Cloudinary destroy unexpected result:', result)
    }
  } catch (e) {
    console.error('Cloudinary destroy failed:', e)
  }
}
