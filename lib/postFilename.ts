export function dateFromFilename(filename: string): Date {
  const match = filename.match(/(?<date>\d\d\d\d-\d\d-\d\d)/)

  if (match === null) {
    throw new Error(`Can't apply date regex pattern on filename ${filename}`)
  }

  const { groups: { date } = { date: undefined} } = match

  if (!date) {
    throw new Error(`Can't extract date from filename ${filename}`)
  }

  return new Date(`${date}T00:00:00`)
}

export function slugFromFilename(filename: string): string {
  const match = filename.match(/(?<date>\d\d\d\d-\d\d-\d\d)-(?<slug>[\w\-\_]*)/)

  if (match === null) {
    throw new Error(`Can't apply slug regex pattern on filename ${filename}`)
  }

  const { groups: { slug } = { slug: undefined} } = match

  if (!slug) {
    throw new Error(`Can't extract slug from filename ${filename}`)
  }

  return slug
}

export function fullNameFromFilename(filename: string): string {
  const match = filename.match(/(?<fullName>\d\d\d\d-\d\d-\d\d-[\w\-\_]*)/)

  if (match === null) {
    throw new Error(`Can't apply fullName regex pattern on filename ${filename}`)
  }

  const { groups: { fullName } = { fullName: undefined} } = match

  if (!fullName) {
    throw new Error(`Can't extract fullName from filename ${filename}`)
  }

  return fullName
}
