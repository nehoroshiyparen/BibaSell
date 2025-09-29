import { IS3 } from "#src/types/contracts/core/s3.interface.js";
import { injectable } from "inversify";

@injectable()
export class S3Impl implements IS3 {
    constructor(

    ) {}

    async upload(key: string, body: Buffer, contentType?: string): Promise<void> {
        
    }

    async get(key: string): Promise<Buffer> {
        
    }

    async delete(key: string): Promise<void> {
        
    }

    async list(prefix?: string): Promise<string[]> {
        
    }
}