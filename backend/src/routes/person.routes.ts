import { Router } from "express";
import { inject, injectable } from "inversify";
import { PersonControllerImpl } from "#src/controllers/person.controller.js";
import { TYPES } from "#src/di/types.js";
import { upload } from "#src/storage/multer.store.js";

@injectable()
export class PersonRouter {
    private router: Router

    constructor(
        @inject(TYPES.PersonController) private personController: PersonControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }

    async setup() {
        this.router.get('/pagination', this.personController.getPersons.bind(this.personController))
        this.router.post('/filtered', this.personController.getFilteredPersons.bind(this.personController))
        this.router.get('/:id', this.personController.getPersonById.bind(this.personController))

        this.router.patch('/bulk', upload.array('files'), this.personController.bulkCreatePersons.bind(this.personController))

        this.router.delete('/bulk', this.personController.bulkDeletePersons.bind(this.personController))
    }

    getRouter(): Router { return this.router }
}