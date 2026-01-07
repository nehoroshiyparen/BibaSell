import { TypeofPersonSchema } from "#src/modules/persons/schemas/Person.schema.js";
import { TypeofPersonFiltersSchema } from "#src/modules/persons/schemas/PersonFilters.schema.js";
import { TypeofPersonFullSchema } from "#src/modules/persons/schemas/PersonFull.schema.js";
import { TypeofPersonPreviewSchema } from "#src/modules/persons/schemas/PersonPreview.schema.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";
import { IBaseService } from "./module.service.interface.js";

export interface IPersonService
    extends IBaseService<
        TypeofPersonFullSchema,
        TypeofPersonPreviewSchema,
        TypeofPersonFiltersSchema,
        TypeofPersonSchema,
        unknown
    > {
        bulkCreate(data: TypeofPersonSchema[], fileConfig: FileConfig): Promise<OperationResult>
    }