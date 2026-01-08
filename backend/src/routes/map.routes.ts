import { TYPES } from "#src/di/types.js";
import { upload } from "#src/infrastructure/storage/multer.store.js";
import { prepareTempDir } from "#src/middlewares/prepareTempDir.middleware.js";
import { MapControllerImpl } from "#src/modules/maps/map.controller.js";
import { Router } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class MapRouter {
    private router: Router
    constructor(
        @inject(TYPES.MapControllerImpl) private mapController: MapControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }

    setup() {
        this.router.get('/', this.mapController.getMaps.bind(this.mapController))
        this.router.get('/slug/:slug', this.mapController.getMapBySlug.bind(this.mapController))
        this.router.get('/:id', this.mapController.getMapById.bind(this.mapController))
        this.router.post('/', prepareTempDir, upload.fields([
            { name: 'map', maxCount: 1 }
        ]), this.mapController.createMap.bind(this.mapController))
        this.router.post('/:id', prepareTempDir, upload.fields([
            { name: 'map', maxCount: 1 }
        ]), this.mapController.updateMap.bind(this.mapController))
        this.router.delete('/bulk', this.mapController.bulkDeleteMaps.bind(this.mapController))
        this.router.delete('/:id', this.mapController.deleteMap.bind(this.mapController))
    }

    getRouter(): Router { return this.router }
}