export interface IS3 {
    upload(key: string, body: Buffer, options?: { contentType?: string, ACL?: string }): Promise<void>
    get(key: string): Promise<Buffer>
    delete(key: string): Promise<void>
    list(prefix?: string): Promise<string[]>
} 