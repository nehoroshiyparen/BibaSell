import { MappingTypeMapping } from 'node_modules/@elastic/elasticsearch/lib/api/types.js'
import PdfArticleMapping from './pdf_article.mapping.js'

export const mappings: Record<string, MappingTypeMapping>  = {
    pdfArticles: PdfArticleMapping
}