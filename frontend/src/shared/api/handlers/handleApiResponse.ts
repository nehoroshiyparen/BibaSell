import { ClientError } from "src/shared/lib/errors/ClientError"
import type { ApiResponse } from "../types/ApiResponse"
import type { AxiosResponse } from "axios"

export const handleApiResponse = <T>(res: AxiosResponse<ApiResponse<T>>, status: number): T => {
    const { data, error } = res.data
    
    if (status >= 200 && status < 300) {
        return data as T
    } else {
        console.log(error?.code, error?.message)
        throw new ClientError(status, error?.code ?? 'UNKNOWN', error?.message ?? 'Unknown error')
    }
}