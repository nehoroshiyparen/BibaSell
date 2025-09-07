import { useAppDispatch } from "src/app/store/hooks";
import type { ApiRequest } from "../types/ApiRequest";
import { startLoading, stopLoading } from "src/app/store/slices/loader.slice";
import { cleanEror, setError } from "src/app/store/slices/error.slice";
import { request } from "./request";
import { handleError } from "src/shared/lib/handlers/handleError";
import type { AppDispatch } from "src/app/store";

export const requestWithRedux = async <Req, Res>(req: ApiRequest<Req, Res>, dispatch: AppDispatch) => {
    try {
        dispatch(cleanEror())

        const data = await request<Req, Res>(req)
        return data
    } catch (e) {
        const handledError = handleError(e)
        dispatch(setError({ code: handledError.code, message: handledError.message }))
        throw e
    }
}