import { MDXArticle } from "#src/infrastructure/sequelize/models/MDXArticle/MDXArticle.model.js"
import { Heading } from "#src/infrastructure/sequelize/models/MDXArticle/Heading.model.js"
import { MDXArticleContent } from "#src/modules/mdxArticles/interfaces/mdxArticles/MDXArticleContent.js"
import { MDXArticlePreview } from "#src/modules/mdxArticles/interfaces/mdxArticles/MDXArticlePreview.js" 
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js"
import { TypeofMDXArticleFiltersSchema } from "#src/modules/mdxArticles/schemas/mdxArticle/MDXArticleFilters.schema.js"
import { TypeofAdvancedMDXArticleSchema } from "#src/modules/mdxArticles/schemas/mdxArticle/MDXArticlePatch.schema.js"
import { TypeofMDXArticleUpdateSchema } from "#src/modules/mdxArticles/schemas/mdxArticle/MDXArticleUpdate.schema.js"

export interface IMDXArticleService  {
    getMDXArticleById(id: number): Promise<MDXArticlePreview>
    getFilteredMDXArticles(filters: TypeofMDXArticleFiltersSchema): Promise<MDXArticlePreview[]>
    searchMDXArticleByContent(content: string): Promise<{ mdxArticle: MDXArticle, content_html: string }>
    getMDXArticleContent(id: number): Promise<MDXArticleContent>
    createMDXArticle(options: TypeofAdvancedMDXArticleSchema, fileConfig: FileConfig | undefined): Promise<MDXArticle>
    updateArcticle(id: number, options: TypeofMDXArticleUpdateSchema, fileConfig: FileConfig | undefined): Promise<{ mdxArticle: MDXArticle, headings: Heading[] | null }>
    bulkDeleteMDXArticles(ids: number[]): Promise<{ status: number }>
}