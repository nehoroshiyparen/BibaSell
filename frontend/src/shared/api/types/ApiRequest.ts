import type { AxiosRequestHeaders, Method } from "axios";

export interface ApiRequest<Req = unknown, Res = unknown> {
    url: string,
    method: Method,
    data?: Req,
    headers?: AxiosRequestHeaders,
    params?: Record<string, any>,
    __responseType?: Res,
}