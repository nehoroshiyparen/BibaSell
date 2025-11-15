export function cleanText(value: any): string {
    if (typeof value !== 'string') return ''

    return value
        .replace(/^[^a-zA-ZА-Яа-я0-9]+/, '')
        .replace(/\s+/g, ' ')
        .trim()
}