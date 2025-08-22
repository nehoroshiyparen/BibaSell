export const isClientError = (e: unknown): boolean => {
    return (
        typeof e === 'object' &&
        e !== null &&
        'name' in e &&
        e.name === 'ClientError'
    )
}