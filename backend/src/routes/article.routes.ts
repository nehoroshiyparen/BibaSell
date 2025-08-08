import { Router } from "express";
import { RouterAbstract } from "src/types/abstractions";

export class ArticleRoute implements RouterAbstract {
    private router: Router

    constructor () {
        this.router = Router()
        this.setup()
    }
    
    async setup(): Promise<void> {
        
    }

    getRouter(): Router {
        return this.router
    }
}