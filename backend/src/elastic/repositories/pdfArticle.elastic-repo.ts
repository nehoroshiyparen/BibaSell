import { TYPES } from "#src/di/types.js";
import { inject, injectable } from "inversify";
import { ElasticEntity } from "#src/types/interfaces/elastic/ElastucEntity.js";
import { IElastic } from "#src/types/contracts/core/elastic.interface.js";

@injectable()
export class PdfArticleElasticRepo {
    private index: string

    constructor(
        @inject(TYPES.Elastic) private elastic: IElastic
    ) {
        this.index = 'pdf_articles'
    }

    async indexArticle(article: ElasticEntity) {
        return this.elastic.indexDocument(this.index, article)
    }

    async searchArticles(query: Record<string, string>, offset?: number, limit?: number) {
        return this.elastic.searchDocument(this.index, query, offset, limit)
    }

    async deleteArticle(id: number) {
        return this.elastic.deleteDocument(this.index, id)
    }
}