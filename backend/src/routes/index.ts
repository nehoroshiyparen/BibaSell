import { Router } from "express";
import { injectable } from "inversify";
import { ROUTES } from "#src/config/index.js";
import { container } from "#src/di/container.js";
import { RouterAbstract } from "#src/types/abstractions/router.abstraction.js";

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
