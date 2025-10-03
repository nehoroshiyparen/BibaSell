import { Person } from "#src/infrastructure/sequelize/models/Person/Person.model.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { TypeofPersonArraySchema } from "#src/modules/persons/schemas/PersonArraySchema.js";
import { TypeofPersonFiltersSchema } from "#src/modules/persons/schemas/PersonFilters.schema.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";

export interface IPersonService {
    getPersonById(id: number): Promise<Person>;
    getPersonBySlug(slug: string): Promise<Person>;
    getPersons(offset: number, limit: number): Promise<Person[] | null>;
    getFilteredPersons(filters: TypeofPersonFiltersSchema, offset?: number, limit?: number): Promise<Person[] | null>;
    bulkCreatePersons(data: TypeofPersonArraySchema, fileConfig: FileConfig): Promise<OperationResult>;
    deletePerson(id: number): Promise<void>;
    bulkDeletePersons(ids: number[]): Promise<OperationResult>;
}