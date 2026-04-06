/** URL segment → display title (Georgian where applicable). */
export const categoryDisplayTitle: Record<string, string> = {
  football: 'ფეხბურთი',
  mma: 'MMA',
  f1: 'ფორმულა 1',
  other: 'სხვა',
}

export function getCategoryTitle(category: string) {
  return categoryDisplayTitle[category] ?? category.replace(/-/g, ' ')
}
