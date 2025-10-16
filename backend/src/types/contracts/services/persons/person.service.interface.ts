import { Person } from "#src/infrastructure/sequelize/models/Person/Person.model.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { TypeofPersonArraySchema } from "#src/modules/persons/schemas/PersonArraySchema.js";
import { TypeofPersonFiltersSchema } from "#src/modules/persons/schemas/PersonFilters.schema.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";
import { TypeofPersonFullSchema } from "#src/modules/persons/schemas/PersonFull.schema.js";
import { TypeofPersonPreviewSchema } from "#src/modules/persons/schemas/PersonPreview.schema.js";

export interface IPersonService {
    getPersonById(id: number): Promise<TypeofPersonFullSchema>;
    getPersonBySlug(slug: string): Promise<TypeofPersonFullSchema>;
    getPersons(offset: number, limit: number): Promise<TypeofPersonPreviewSchema[] | null>;
    getFilteredPersons(filters: TypeofPersonFiltersSchema, offset?: number, limit?: number): Promise<TypeofPersonPreviewSchema[] | null>;
    bulkCreatePersons(data: TypeofPersonArraySchema, fileConfig: FileConfig): Promise<OperationResult>;
    deletePerson(id: number): Promise<void>;
    bulkDeletePersons(ids: number[]): Promise<OperationResult>;
}