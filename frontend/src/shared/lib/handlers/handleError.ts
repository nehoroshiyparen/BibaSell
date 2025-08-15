import { isAxiosError } from "axios"
import { isClientError } from "../typeGuards/isClientError"

export function handleError(e: unknown) {
    if (isAxiosError(e)) {
        const data = e.response?.data
        if (isClientError(e)) {
            return {
                code: data?.code ?? 'CLIENT_ERROR',
                message: data?.message ?? 'Client error'
            }
        } else if (typeof data?.message === 'string') {
            return {
                code: data?.code ?? 'AXIOS_ERROR',
                message: data.message
            }
        }
    } else if (e instanceof Error) {
        return {
            code: 'ERROR',
            message: e.message
        }
    }

    return {
        code: 'UNKNOWN',
        message: 'Something gone wrong... ¯\_(ツ)_/¯'
    }
}