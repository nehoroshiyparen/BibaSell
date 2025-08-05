import { Router } from "express";
import { inject, injectable } from "inversify";
import { PersonControllerImpl } from "src/controllers/person.controller";
import { TYPES } from "src/di/types";

@injectable()
export class PersonRouter {
    private router: Router

    constructor(
        @inject(TYPES.PersonControllerImpl) private personController: PersonControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }

    async setup() {
        this.router.get('/:id', this.personController.getPersonById)
        this.router.get('/pagination', this.personController.getPersons)
        this.router.get('/filtered', this.personController.getFilteredPersons)
        this.router.patch('/pack', this.personController.uploadPersonPack)
        this.router.delete('/pack', this.personController.deletePersons)
    }

    getRouter(): Router { return this.router }
}