export interface IBaseS3Repo {
    upload(key: string, body: Buffer, options?: { contentType?: string, ACL?: string }): Promise<void>
    get(key: string): Promise<Buffer>
    delete(key: string): Promise<void>
    list(prefix?: string): Promise<string[]>
    generateSignedUrls(keys: string[]): Promise<Record<string, string>>
} 