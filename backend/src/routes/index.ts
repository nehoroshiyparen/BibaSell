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

    constructor () {
        this.router = Router()
        this.setup()
    }

    async setup() {
        await Promise.all(ROUTES.map(async ({path, router}) => {
            try {
                const instance = await container.getAsync<RouterAbstract>(router);
                this.router.use('/api' + path, instance.getRouter());
            } catch (error) {
                console.error(`❌ Failed ${path}:`, error);
            }
        }));
    }

    getRouter() { return this.router }
}
