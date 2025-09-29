export interface IS3 {
    upload(key: string, body: Buffer, contentType?: string): Promise<void>
    get(key: string): Promise<Buffer>
    delete(key: string): Promise<void>
    list(prefix?: string): Promise<string[]>
} 