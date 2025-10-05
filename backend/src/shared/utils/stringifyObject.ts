export function stringifyObject(obj: Record<string, any> | null): string {
    if (obj === null) return 'NULL'
    return JSON.stringify(obj)
}