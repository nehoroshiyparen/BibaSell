import { StoreLogger } from "#src/lib/logger/instances/store.logger.js";
import { generateUuid } from "#src/shared/crypto/generateUuid.js";
import { stringifyObject } from "#src/shared/utils/stringifyObject.js";
import { injectable } from "inversify";
import {
  FindOptions,
  Model,
  ModelStatic,
  Sequelize,
  WhereOptions,
} from "sequelize";
import { ExtendedTransaction as Transaction } from "./extentions/Transaction.js";

@injectable()
export abstract class BaseSequelizeRepo<T extends Model> {
  protected sequelize: Sequelize;
  protected model: ModelStatic<T>;
  protected logger: StoreLogger;

  constructor(
    sequelize: Sequelize,
    model: ModelStatic<T>,
    logger: StoreLogger,
  ) {
    this.sequelize = sequelize;
    this.model = model;
    this.logger = logger;
  }

  async findById(id: number): Promise<T | null> {
    const options = this.getFindByIdOptions();

    const record = await this.model.findByPk(id, options);
    this.logger.operations.fetched(stringifyObject(record));
    return record;
  }

  async findBySlug(slug: string): Promise<T | null> {
    const options = this.getFindBySlugOptions();

    const record = await this.model.findOne({
      where: { slug: slug as any },
      ...options,
    });
    this.logger.operations.fetched(stringifyObject(record));
    return record;
  }

  async findAll({
    offset,
    limit,
    where,
  }: {
    offset?: number;
    limit?: number;
    where?: WhereOptions<any>;
  }): Promise<T[]> {
    const options = this.getFindAllOptions() ?? {};

    const findOptions: any = {
      ...options,
    };

    if (where && Object.keys(where).length) {
      findOptions.where = where;
    }

    if (Number.isInteger(offset)) findOptions.offset = offset;
    if (Number.isInteger(limit)) findOptions.limit = limit;

    const records = await this.model.findAll(findOptions);
    this.logger.operations.fetched(
      stringifyObject(records),
      findOptions.where,
      records.length,
    );
    return records;
  }

  async destroy(
    id: number | number[],
    transaction?: Transaction,
  ): Promise<void> {
    await this.model.destroy({ where: { id: id as any }, transaction });
    this.logger.operations.deleted(id);
  }

  async createTransaction(): Promise<Transaction> {
    const uuid = generateUuid();
    const trx = await this.sequelize.transaction();
    this.logger.transactions.started(uuid);
    return Object.assign(trx, { name: uuid });
  }

  async commitTransaction(transaction: Transaction): Promise<void> {
    this.logger.transactions.commited(transaction.name);
    await transaction.commit();
  }

  async rollbackTransaction(transaction: Transaction): Promise<void> {
    this.logger.transactions.rolledBack(transaction.name);
    await transaction.rollback();
  }

  protected getFindByIdOptions(): FindOptions {
    return {};
  }

  protected getFindBySlugOptions(): FindOptions {
    return {};
  }

  protected getFindAllOptions(): FindOptions {
    return {};
  }
}
