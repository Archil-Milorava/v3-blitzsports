import { format } from 'date-fns'
import { ka } from 'date-fns/locale'

export const getPlainTextExcerpt = (html: string, length: number = 300) => {
  const plainText = html.replace(/<[^>]*>?/gm, '')
  return plainText.length > length ? plainText.substring(0, length) + '...' : plainText
}

export const publishDate = (date: string | Date | number) =>
  format(new Date(date), 'd MMMM yyyy', { locale: ka })
