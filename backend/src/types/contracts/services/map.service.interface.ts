import { TypeofMapFiltersSchema } from "#src/modules/maps/schemas/MapFilters.schema.js";
import { TypeofMapFullSchema } from "#src/modules/maps/schemas/MapFull.schema.js";
import { TypeofMapPatchSchema } from "#src/modules/maps/schemas/MapPatch.schema.js";
import { TypeofMapPreviewSchema } from "#src/modules/maps/schemas/MapPreview.schema.js";
import { TypeofMapUpdateSchema } from "#src/modules/maps/schemas/MapUpdate.schema.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { IBaseService } from "./module.service.interface.js";

export interface IMapService 
    extends IBaseService<
        TypeofMapFullSchema,
        TypeofMapPreviewSchema,
        TypeofMapFiltersSchema,
        TypeofMapPatchSchema,
        TypeofMapUpdateSchema
    > {
        create(options: TypeofMapPatchSchema, fileConfig: FileConfig): Promise<TypeofMapFullSchema>
        update(id: number, options: TypeofMapUpdateSchema, fileConfig: FileConfig | undefined): Promise<TypeofMapFullSchema>
    }