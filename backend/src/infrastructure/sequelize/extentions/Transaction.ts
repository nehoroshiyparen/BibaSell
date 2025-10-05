import { Transaction } from 'sequelize'

export type ExtendedTransaction = Transaction & { name: string }