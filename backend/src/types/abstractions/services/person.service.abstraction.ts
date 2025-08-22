import { Person } from "#src/database/models/Person.model.js";
import { TypeofPersonArraySchema } from "#src/types/schemas/person/PersonArraySchema.js";
import { TypeofPersonFiltersSchema } from "#src/types/schemas/person/PersonFilters.schema.js";

export interface PersonServiceAbstract {
    getPersonById(id: number): Promise<Person>;
    getPersons(offset: number, limit: number): Promise<Person[] | null>;
    getFilteredPersons(filters: TypeofPersonFiltersSchema): Promise<Person[] | null>
    bulkCreatePersons(data: TypeofPersonArraySchema, fileConfig: { tempDirPath: string, files?: Express.Multer.File[] | undefined }): Promise<{ status: number }>;
    bulkDeletePersons(ids: number[]): Promise<{ status: number }>;
}