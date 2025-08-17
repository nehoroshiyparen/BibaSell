import { Router } from "express";
import { inject, injectable } from "inversify";
import { PersonControllerImpl } from "src/controllers/person.controller";
import { TYPES } from "src/di/types";

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

        this.router.patch('/pack', this.personController.uploadPersonPack.bind(this.personController))

        this.router.delete('/pack', this.personController.deletePersons.bind(this.personController))
    }

    getRouter(): Router { return this.router }
}