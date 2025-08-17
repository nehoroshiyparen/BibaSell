import { Person } from "src/database/models/Person.model";
import { TypeofPersonArraySchema } from "src/types/schemas/person/PersonArraySchema";
import { TypeofPersonFiltersSchema } from "src/types/schemas/person/PersonFilters.schema";

export interface PersonServiceAbstract {
    getPersonById(id: number): Promise<Person>;
    getPersons(offset: number, limit: number): Promise<Person[] | null>;
    getFilteredPersons(filters: TypeofPersonFiltersSchema): Promise<Person[] | null>
    bulkCreatePersons(data: TypeofPersonArraySchema): Promise<{ status: number }>;
    bulkDeletePersons(ids: number[]): Promise<{ status: number }>;
}