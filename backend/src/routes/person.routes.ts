import { Router } from "express";
import { inject, injectable } from "inversify";
import { PersonControllerImpl } from "#src/modules/persons/controllers/person.controller.js";
import { TYPES } from "#src/di/types.js";
import { upload } from "#src/infrastructure/storage/multer.store.js";
import { prepareTempDir } from "#src/middlewares/prepareTempDir.middleware.js";

@injectable()
export class PersonRouter {
    private router: Router

    constructor(
        @inject(TYPES.PersonController) private personController: PersonControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }

    setup() {
        this.router.get('/', this.personController.getPersons.bind(this.personController))
        this.router.post('/filtered', this.personController.getFilteredPersons.bind(this.personController))
        this.router.get('/slug/:slug', this.personController.getPersonBySlug.bind(this.personController)) 
        this.router.get('/:id', this.personController.getPersonById.bind(this.personController))

        this.router.post('/bulk', prepareTempDir, upload.fields([
            { name: 'images', maxCount: 50 },
        ]), this.personController.bulkCreatePersons.bind(this.personController))

        this.router.delete('/bulk', this.personController.bulkDeletePersons.bind(this.personController))
        this.router.delete('/:id', this.personController.deletePerson.bind(this.personController))
    }

    getRouter(): Router { return this.router }
}