import { injectable } from "inversify";
import { Logger } from "../base.logger.js";

@injectable()
export class AppLogger extends Logger {
    constructor () {
        super('AppLogger', 'app.log')
    }

    started(name: string, port: number) {
        this.info(`App ${name} is started on port ${port} \n\n`)
    }

    stopped() {
        this.warn('App is stopped')
    }

    storeInitialized(name: string) {
        this.info(`Store "${name}" is initialized`)
    }

    storeFailed(name: string, error: unknown) {
        this.error(`Store "${name}" failed to initialize: ${String(error)}`)
    }

    serviceInitialized(name: string) {
        this.info(`Service "${name}" is initialized`)
    }

    serviceFailed(name: string, error: unknown) {
        this.error(`Service "${name}" failed to initialize: ${String(error)}`)
    }

    uncaughtException(error: Error) {
        this.error(`Uncaught exception: ${error.message} \n${error.stack}`)
    }
}