import { ZodError } from 'zod'

export function isZodError(err: unknown): err is ZodError {
    return typeof err === 'object' &&
        err !== null &&
        'name' in err &&
        (err as any).name === 'ZodError'
}