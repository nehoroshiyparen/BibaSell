export class ClientError extends Error {
    status: number
    code: string

    constructor(
        status: number,
        code: string,
        message: string
    ) {
        super(message)
        this.name = 'ClientError'
        this.status = status
        this.code = code
    }
}