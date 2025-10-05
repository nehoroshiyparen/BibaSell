import winston from 'winston'
import path from 'path'
import fs from 'fs'

const { combine, timestamp, printf, colorize, align } = winston.format

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    create: 3,
    update: 4,
    delete: 5,
    debug: 6,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    create: 'cyan',
    update: 'blue',
    delete: 'magenta',
    debug: 'gray',
  },
}

winston.addColors(customLevels.colors)

const devFormat = printf(({ level, message, timestamp, context }) => {
  const ctx = context ? `[${context}]` : ''
  return `${timestamp} ${level}: ${ctx} ${message}`
})

export class Logger {
  protected logger: winston.Logger

  constructor(
    protected readonly context: string,
    protected readonly logFile?: string,
  ) {
    const logDir = 'logs'
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)

    const transports: winston.transport[] = [new winston.transports.Console()]

    if (logFile) {
      transports.push(
        new winston.transports.File({
          filename: path.join(logDir, logFile),
          maxsize: 5_000_000,
        }),
      )
    }

    this.logger = winston.createLogger({
      levels: customLevels.levels,
      level: process.env.LOG_LEVEL || 'debug',
      format: combine(colorize({ all: true }), timestamp({ format: 'HH:mm:ss' }), align(), devFormat),
      transports,
    })
  }

  protected log(level: string, message: string) {
    this.logger.log({ level, message, context: this.context })
  }

  info(msg: string) { this.log('info', msg) }
  warn(msg: string) { this.log('warn', msg) }
  error(msg: string) { this.log('error', msg) }
  debug(msg: string) { this.log('debug', msg) }
}