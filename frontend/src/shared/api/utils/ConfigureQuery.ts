export const ConfigureQuery = (params: Record<string, any>): string => {
    if (params.size === 0) return ''

    const query = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&')

    return query ? `?${query}` : ''
}