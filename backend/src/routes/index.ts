import { Router } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "src/di/types";
import { PersonRouter } from "./person.routes";
import { ROUTES } from "src/config";
import { container } from "src/di/container";
import { RouterAbstract } from "src/types/abstractions/router.abstraction";

@injectable()
export class IndexRouter implements RouterAbstract {
    private router: Router

    constructor(
        @inject(TYPES.PersonRouter) private personRouter: PersonRouter
    ) {
        this.router = Router()
    }

    async setup() {
        ROUTES.forEach(({path, router}) => {
            const instance: RouterAbstract = container.get(router)
            this.router.use(path, instance.getRouter())
        })
    }

    getRouter() { return this.router }
}
