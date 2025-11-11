import { api } from "../client"
import { handleApiResponse } from "../handlers/handleApiResponse"
import type { ApiRequest } from "../types/ApiRequest"
import type { ApiResponse } from "../types/ApiResponse"

export const request = async <Req, Res>(req: ApiRequest<Req, Res>): Promise<Res> => {
    const response = await api.request<ApiResponse<Res>>({
        url: 'http://localhost:7812' + '/api' + req.url,
        method: req.method,
        data: req.data,
        params: { ...(req.params || {}), _ts: Date.now() },
        headers: { ...(req.headers || {}), 'Cache-Control': 'no-cache', 'Pragma': 'no-cache', 'Expires': '0', },
        timeout: 10000,
        validateStatus: () => true,
    })

    const data = handleApiResponse(response, response.status)
    return data
}