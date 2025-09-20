import { Router } from "express"

export interface IRouter {
    setup(): Promise<void>
    getRouter(): Router
}