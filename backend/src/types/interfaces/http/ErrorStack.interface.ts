import { Error } from "./Error.interface.js";

export interface ErrorStack {
    [key: string | number]: Error
}