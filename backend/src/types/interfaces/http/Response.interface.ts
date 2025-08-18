import { Error } from "./Error.interface.js";

export interface ApiResponse<T> {
    message: string,
    data?: T,
    error?: Error
}