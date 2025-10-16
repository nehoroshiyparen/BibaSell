import pdf from 'pdf-parse'

export async function pdfParse(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer)
    return data.text
} 