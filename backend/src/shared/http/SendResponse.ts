import { Response } from "express";
import { ApiResponse } from "#src/types/interfaces/http/Response.interface.js";

export function SendResponse<T>(
    res: Response, 
    status: number,
    message: string,
    data: T
) {
    const response: ApiResponse<T> = {
        message,
        data
    }

    return res.status(status).json(response)
}