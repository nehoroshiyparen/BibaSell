import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js"
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js"

export interface IBaseService<
    TFull,
    TPreview,
    TFilters,
    TCreate,
    TUpdate
> {
    getById(id: number): Promise<TFull>
    getBySlug(slug: string): Promise<TFull>
    getList(
        offset?: number,
        limit?: number
    ): Promise<TPreview[]>
    getFiltered(
        filters: TFilters,
        offset?: number,
        limit?: number,
    ): Promise<TPreview[]>
    create?(options: TCreate, fileConfig: FileConfig): Promise<TFull>
    bulkCreate?(data: TCreate[], fileConfig: FileConfig): Promise<OperationResult>
    update?(options: TUpdate, fileConfig: FileConfig | undefined): Promise<TFull>
    delete(id: number): Promise<void>
    bulkDelete(ids: number[]): Promise<OperationResult>
}