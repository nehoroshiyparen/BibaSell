import { Error } from "./Error.interface";

export interface ApiResponse<T> {
    message: string,
    data?: T,
    error?: Error
}