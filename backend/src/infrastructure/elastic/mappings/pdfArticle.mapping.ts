import { MappingTypeMapping } from "node_modules/@elastic/elasticsearch/lib/api/types.js"

const mapping: MappingTypeMapping = {
    properties: {
        title: { type: 'text' },
        extractedText: { type: 'text' },
        publishedAt: { type: 'date' },
        updatedAt: { type: 'date' },
        key: { type: 'keyword' }
    }
}
export default mapping