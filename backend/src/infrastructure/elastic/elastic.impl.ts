import { ENV } from "#src/config/env.js";
import { IElastic } from "#src/types/contracts/core/elastic.interface.js";
import { CreateIndexResult } from "#src/types/interfaces/elastic/CreateIndexResult.js";
import { ElasticEntity } from "#src/types/interfaces/elastic/ElastucEntity.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { Client, estypes } from "@elastic/elasticsearch";
import { injectable } from "inversify";
import { DeleteResponse, IndexResponse } from "node_modules/@elastic/elasticsearch/lib/api/types.js";

@injectable()
export class ElasticImpl implements IElastic {
    private client: Client

    constructor(url?: string) {
        this.client = new Client({ 
            node: url ?? `${ENV.ELASTIC_HOST}:${String(ENV.ELASTIC_PORT)}`
         })
    }

    async createIndex(index: string, mappings?: estypes.MappingTypeMapping): Promise<CreateIndexResult> {
        const exists = await this.client.indices.exists({ index })
        if (exists) throw ApiError.Conflict(`Index ${index} already exists`, 'INDEX_ALREADY_EXISTS')
        
        const params = await this.client.indices.create({
            index,
            body: mappings
                ? mappings
                : {}
        })
        return {
            index: params.index,
            acknowledged: params.acknowledged,
            shardsAcknowledged: params.shards_acknowledged
        }
    }

    async createIndexes(config: Record<string, estypes.MappingTypeMapping>) {
        const results: Record<string, { success: boolean, error?: any }> = {}

        for (const index of Object.keys(config)) {
            try {
                await this.createIndex(index, config[index])
                results[index] = { success: true }
            } catch (e) {
                results[index] = { success: false, error: e }
            }
        }

        console.log(`Elastic is connected on port: ${ENV.ELASTIC_PORT}}`)

        return results
    }

    async indexDocument<T extends ElasticEntity>(index: string, entity: T): Promise<IndexResponse> {
        const res = await this.client.index({
            index,
            id: entity.id?.toString(),
            document: entity
        })
        return res
    }

    async searchDocument<T extends ElasticEntity>(
        index: string, 
        query: Record<string, string>, 
        from: number = 0,
        size: number = 10,
    ): Promise<T[]> {
        const should = Object.entries(query)
            .filter(([_, value]) => value)
            .map(([field, value]) => ({ match: { [field]: value }}))

        const res = await this.client.search<T>({
            index,
            from,
            size,
            query: {
                bool: {
                    should,
                    minimum_should_match: 1 // хотя бы одно совпадение
                }
            }
        })
        return res.hits.hits.map(hit => hit._source as T)
    }

    async deleteDocument(index: string, id: string | number): Promise<estypes.DeleteResponse> {
        const res = await this.client.delete({
            index,
            id: String(id)
        })
        return res
    }

    async health(): Promise<estypes.ClusterHealthHealthResponseBody> {
        const res = await this.client.cluster.health()
        return res
    }
}