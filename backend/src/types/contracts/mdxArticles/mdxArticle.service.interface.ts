import { MDXArticle } from "#src/database/models/MDXArticle.model.js"
import { Heading } from "#src/database/models/MDXArticle/Heading.model.js"
import { MDXArticleContent } from "#src/types/interfaces/mdxArticles/MDXArticleContent.js"
import { MDXArticlePreview } from "#src/types/interfaces/mdxArticles/MDXArticlePreview.js"
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js"
import { TypeofMDXArticleFiltersSchema } from "#src/types/schemas/mdxArticle/MDXArticleFilters.schema.js"
import { TypeofAdvancedMDXArticleSchema } from "#src/types/schemas/mdxArticle/MDXArticlePatch.schema.js"
import { TypeofMDXArticleUpdateSchema } from "#src/types/schemas/mdxArticle/MDXArticleUpdate.schema.js"

export interface IMDXArticleService  {
    getMDXArticleById(id: number): Promise<MDXArticlePreview>
    getFilteredMDXArticles(filters: TypeofMDXArticleFiltersSchema): Promise<MDXArticlePreview[]>
    searchMDXArticleByContent(content: string): Promise<{ mdxArticle: MDXArticle, content_html: string }>
    getMDXArticleContent(id: number): Promise<MDXArticleContent>
    createMDXArticle(options: TypeofAdvancedMDXArticleSchema, fileConfig: FileConfig | undefined): Promise<MDXArticle>
    updateArcticle(id: number, options: TypeofMDXArticleUpdateSchema, fileConfig: FileConfig | undefined): Promise<{ mdxArticle: MDXArticle, headings: Heading[] | null }>
    bulkDeleteMDXArticles(ids: number[]): Promise<{ status: number }>
}