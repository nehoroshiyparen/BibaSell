import { Error } from "./Error.interface.js";

export interface ErrorStack {
    message?: string;
    code?: string;
    [key: string]: any;
}