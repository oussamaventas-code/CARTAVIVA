const DIACRITICS_REGEX = new RegExp('[\\u0300-\\u036f]', 'g')

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
