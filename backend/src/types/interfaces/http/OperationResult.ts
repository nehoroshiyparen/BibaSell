import { Error } from "./Error.interface.js";

export interface OperationResult<TError = any> {
    success: boolean,
    errors?: Record<string | number, TError>,
    [key: string]: any
}