import { Router } from "express"

export interface RouterAbstract {
    setup(): Promise<void>
    getRouter(): Router
}