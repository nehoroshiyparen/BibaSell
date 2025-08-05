import { Person } from "src/database/models/Person.model";
import { PersonArray } from "src/types/schemas/person/PersonArraySchema";
import { PersonFilters } from "src/types/interfaces/filters/PersonFilters.interface";

export interface PersonServiceAbstract {
    getPersonById(id: number): Promise<Person>;
    getPersons(offset: number, limit: number): Promise<Person[] | null>;
    getFilteredPersons(filters: PersonFilters): Promise<Person[] | null>
    uploadPersonPack(data: PersonArray): Promise<{ status: number }>;
    deletePersons(ids: number[]): Promise<{ status: number }>;
}