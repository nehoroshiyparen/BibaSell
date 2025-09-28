import { CreateIndexResult } from "#src/types/interfaces/elastic/CreateIndexResult.js";
import { ElasticEntity } from "#src/types/interfaces/elastic/ElastucEntity.js";
import { estypes } from "@elastic/elasticsearch";
import { DeleteResponse, IndexResponse } from "node_modules/@elastic/elasticsearch/lib/api/types.js";

export interface IElastic {
    createIndex(
        index: string, 
        mappings?: estypes.MappingTypeMapping
    ): Promise<CreateIndexResult>
    indexDocument<T extends ElasticEntity>(
        index: string, 
        entity: T
    ): Promise<IndexResponse> 
    searchDocument<T extends ElasticEntity>(
        index: string, 
        query: Record<string, string>, 
        from?: number, // offset
        size?: number, // limit
    ): Promise<T[]>
    deleteDocument(
        index: string, 
        id: string | number
    ): Promise<DeleteResponse>
    health(): Promise<estypes.ClusterHealthHealthResponseBody>
}