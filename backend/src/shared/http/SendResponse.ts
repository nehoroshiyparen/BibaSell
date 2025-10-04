import { Response } from "express";
import { ApiResponse } from "#src/types/interfaces/http/Response.interface.js";
import { ResponsePayload } from "#src/types/contracts/http/ResponsePayload.interface.js";
import { resolveCase } from "./resolveField.js";

export function SendResponse<T = any>(
    res: Response, 
    options: ResponsePayload<T>
) {
    const resolved = resolveCase(options.cases)

    const status = resolved?.status ?? 500
    const message = resolved?.message ?? 'Unknown error'

    return res.status(status).json({
        status,
        message,
        data: options.data
    })
}