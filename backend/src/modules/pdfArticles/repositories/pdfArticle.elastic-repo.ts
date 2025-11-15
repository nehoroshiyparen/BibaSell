import { TYPES } from "#src/di/types.js";
import { inject, injectable } from "inversify";
import { ElasticEntity } from "#src/types/interfaces/elastic/ElastucEntity.js";
import { IElastic } from "#src/types/contracts/core/elastic.interface.js";
import { PdfArticle } from "#src/infrastructure/sequelize/models/PdfArticle/PdfArticle.model.js"; 
import { MappingTypeMapping } from "node_modules/@elastic/elasticsearch/lib/api/types.js";

@injectable()
export class PdfArticleElasticRepo {
    private index: string

    constructor(
        @inject(TYPES.Elastic) private elastic: IElastic
    ) {
        this.index = 'pdf_articles'
    }

    async indexArticle(article: ElasticEntity) {
        return await this.elastic.indexDocument(this.index, article)
    }

    async searchArticles(query: Record<string, string>, offset?: number, limit?: number) {
        return await this.elastic.searchDocument<PdfArticle>(this.index, query, offset, limit)
    }

    async destroyArticle(id: number) {
        return await this.elastic.deleteDocument(this.index, id)
    }

    public getIndexName() {
        return this.index
    }
}