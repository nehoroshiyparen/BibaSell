import { TYPES } from "#src/di/types.js";
import { IDatabase } from "#src/types/contracts/index.js";
import { inject, injectable } from "inversify";
import { FindOptions, Transaction, WhereOptions } from "sequelize";
import { Person } from "#src/infrastructure/sequelize/models/person.js";
import { Reward } from "#src/infrastructure/sequelize/models/reward.js";
import { TypeofPersonSchema } from "../schemas/Person.schema.js";
import { BaseSequelizeRepo } from "#src/infrastructure/sequelize/base.sequelize-repo.js";
import { StoreLogger } from "#src/lib/logger/instances/store.logger.js";
import { stringifyObject } from "#src/shared/utils/stringifyObject.js";
import { TypeofPersonRewardsSchema } from "../schemas/PersonRewards.schema.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { PersonRewards } from "#src/infrastructure/sequelize/models/associations/person_rewards.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";
import { ErrorStack } from "#src/types/interfaces/http/ErrorStack.interface.js";
import { isError } from "#src/shared/typeGuards/isError.js";

@injectable()
export class PersonSequelizeRepo extends BaseSequelizeRepo<Person> {
  constructor(
    @inject(TYPES.Database) private database: IDatabase,
    @inject(TYPES.SequelizeLogger) protected logger: StoreLogger,
  ) {
    super(database.getDatabase(), Person, logger);
  }

  async create(
    data: TypeofPersonSchema & { slug: string },
    options?: { key?: string },
    transaction?: Transaction,
  ): Promise<Person> {
    const person = await Person.create(
      {
        ...data,
        ...options,
      },
      { transaction },
    );
    this.logger.operations.created(stringifyObject(person), person.id);
    return person;
  }

  async createPersonsRewrads(
    data: TypeofPersonRewardsSchema,
    options?: { transaction?: Transaction },
  ): Promise<OperationResult> {
    const errorStack: ErrorStack = {};
    let created = 0;

    const transaction = options?.transaction;

    const labels = data.rewards.map((r) => r.label);
    const rewardsFromDb = await Reward.findAll({
      where: { label: labels },
    });

    const rewardsMap = new Map(rewardsFromDb.map((r) => [r.label, r.id]));

    // Проверяем, что все награды существуют
    for (const reward of data.rewards) {
      if (!rewardsMap.has(reward.label)) {
        throw ApiError.NotFound(
          `Reward with label: ${reward.label} was not found`,
        );
      }
    }

    // Создаём записи
    const personRewardsToCreate = data.rewards.map((r) => ({
      person_id: data.person_id,
      reward_id: rewardsMap.get(r.label)!,
    }));

    Promise.all(
      personRewardsToCreate.map(async (r) => {
        try {
          await PersonRewards.create(r, { transaction });
          created++;
        } catch (e) {
          let message = "Internal error";
          if (isError(e)) {
            message = e.message;
            const pgError = (e as any).original;
            if (pgError?.detail) {
              message += ` - ${pgError.detail}`;
            }
          }

          errorStack[`person_id: ${r.person_id}, reward_id: ${r.reward_id}`] = {
            message,
            code: "REWARD_CREATE_ERROR",
          };
        }
      }),
    );

    return Object.keys(errorStack).length > 0
      ? { success: false, created, errors: errorStack }
      : { success: true, created };
  }

  /**
   *
   * @returns FindById options
   */
  protected getFindByIdOptions(): FindOptions {
    return {
      include: [
        {
          model: Reward,
          as: "rewards",
          attributes: ["key", "label"],
          through: { attributes: [] },
        },
      ],
    };
  }

  /**
   *
   * @returns FindBySlug options
   */
  protected getBySlugOptions(): FindOptions {
    return {
      include: [
        {
          model: Reward,
          as: "rewards",
          attributes: ["key", "label"],
          through: { attributes: [] },
        },
      ],
    };
  }
}
