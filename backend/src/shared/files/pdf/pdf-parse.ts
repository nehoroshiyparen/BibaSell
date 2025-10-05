import pdf from 'pdf-parse'
import fs from 'fs'

export async function pdfParse(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer)
    return data.text
} 