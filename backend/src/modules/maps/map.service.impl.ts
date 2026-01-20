import { TYPES } from "#src/di/types.js";
import { IMapService } from "#src/types/contracts/services/map.service.interface.js";
import { inject, injectable } from "inversify";
import { MapSequelizeRepo } from "./map.sequelize.repo.js";
import { S3MapServiceImpl } from "./S3Map.service.impl.js";
import { MapMapper } from "./map.mapper.js";
import { TypeofMapFullSchema } from "./schemas/MapFull.schema.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { TypeofMapPatchSchema } from "./schemas/MapPatch.schema.js";
import { TypeofMapUpdateSchema } from "./schemas/MapUpdate.schema.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";
import { TypeofMapFiltersSchema } from "./schemas/MapFilters.schema.js";
import { TypeofMapPreviewSchema } from "./schemas/MapPreview.schema.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { RethrowApiError } from "#src/shared/ApiError/RethrowApiError.js";
import { Op } from "sequelize";
import { Map } from "#src/infrastructure/sequelize/models/map.js";
import { ErrorStack } from "#src/types/interfaces/http/ErrorStack.interface.js";
import { generateUuid } from "#src/shared/crypto/generateUuid.js";
import { readFile } from "#src/shared/files/utils/readFile.js";
import { getSlug } from "#src/shared/slugging/getSlug.js";
import { removeDir } from "#src/shared/files/remove/removeDir.js";
import { cleanup } from "#src/shared/utils/object.cleanup.js";
import { ExtendedTransaction } from "#src/infrastructure/sequelize/extentions/Transaction.js";

@injectable()
export class MapServiceImpl implements IMapService {
  constructor(
    @inject(TYPES.MapSequelizeRepo) private sequelize: MapSequelizeRepo,
    @inject(TYPES.S3MapService) private s3: S3MapServiceImpl,
    @inject(TYPES.MapMapper) private mapper: MapMapper,
  ) {}

  async getById(id: number): Promise<TypeofMapFullSchema> {
    try {
      const map = await this.sequelize.findById(id);
      if (!map) throw ApiError.NotFound("Map not found");
      return await this.mapper.toFull(map);
    } catch (e) {
      RethrowApiError(`Service error: Method - getMapById`, e);
    }
  }

  async getBySlug(slug: string): Promise<TypeofMapFullSchema> {
    try {
      const map = await this.sequelize.findBySlug(slug);
      if (!map) throw ApiError.NotFound("Map not found");
      return await this.mapper.toFull(map);
    } catch (e) {
      RethrowApiError(`Service error: Method - getMapBySlug`, e);
    }
  }

  async getList(
    offset = 0,
    limit = 10,
    filters: Partial<TypeofMapFiltersSchema> = {},
  ): Promise<TypeofMapPreviewSchema[]> {
    try {
      const where: any = {};

      if (filters.title) where.title = { [Op.iLike]: `%${filters.title}%` };
      if (filters.description)
        where.description = { [Op.iLike]: `%${filters.description}%` };

      let maps: Map[];

      if (Object.keys(where).length) {
        maps = await this.sequelize.findAll({ offset, limit, where });
      } else {
        maps = await this.sequelize.findAll({ offset, limit });
      }

      return await this.mapper.toPreview(maps);
    } catch (e) {
      RethrowApiError(`Service error: Method - getList`, e);
    }
  }

  async create(
    options: TypeofMapPatchSchema,
    fileConfig: FileConfig,
  ): Promise<TypeofMapFullSchema> {
    const transaction = await this.sequelize.createTransaction();
    const key = generateUuid();

    try {
      const file = fileConfig.files.map as Express.Multer.File;
      const buffer = await readFile(file.path);

      const slug = getSlug(options.title);

      const map = await this.sequelize.create(
        {
          ...options,
          slug: slug!,
          key: key,
        },
        transaction,
      );

      await this.s3.upload(key, buffer);

      await this.sequelize.commitTransaction(transaction);
      return await this.mapper.toFull(map);
    } catch (e) {
      await this.safeCleanup(key);
      await this.sequelize.rollbackTransaction(transaction);
      throw RethrowApiError(`Service error: Methd - createMap`, e);
    } finally {
      fileConfig && removeDir(fileConfig.tempDirPath);
    }
  }

  async update(
    id: number,
    options: TypeofMapUpdateSchema,
    fileConfig: FileConfig,
  ): Promise<TypeofMapFullSchema> {
    const transaction = await this.sequelize.createTransaction();

    const map = await this.sequelize.findById(id);
    if (!map) throw ApiError.NotFound(`Article with id: ${id} is not found`);

    try {
      const file = fileConfig.files.map as Express.Multer.File | undefined;

      const slug = options.title ? getSlug(options.title) : undefined;
      const updateData: Partial<TypeofMapUpdateSchema & { slug: string }> =
        cleanup({
          title: options.title,
          description: options.description,
          year: options.year,
          slug,
        }) as Partial<TypeofMapUpdateSchema>;

      const updatedMap = await this.sequelize.update(
        id,
        updateData,
        transaction,
      );

      if (file) {
        await this.updateMapFile(map, updatedMap, file, transaction);
      }

      await this.sequelize.commitTransaction(transaction);
      const finalMap = await this.sequelize.findById(id);
      return await this.mapper.toFull(finalMap!);
    } catch (e) {
      await this.sequelize.rollbackTransaction(transaction);
      throw RethrowApiError("Service error: Method - updateMap", e);
    } finally {
      fileConfig && removeDir(fileConfig.tempDirPath);
    }
  }

  async delete(id: number): Promise<void> {
    const transaction = await this.sequelize.createTransaction();

    try {
      const map = await this.sequelize.findById(id);
      if (!map) throw ApiError.NotFound(`Map with id: ${id} is not found`);

      await this.sequelize.destroy(id, transaction);
      if (map.key) await this.s3.delete(map.key);
      await this.sequelize.commitTransaction(transaction);
    } catch (e) {
      await this.sequelize.rollbackTransaction(transaction);
      RethrowApiError(`Service error: Method - deleteMap`, e);
    }
  }

  async bulkDelete(ids: number[]): Promise<OperationResult> {
    const transaction = await this.sequelize.createTransaction();
    const errorStack: ErrorStack = {};

    try {
      const maps = await this.sequelize.findAll({ where: { id: ids } });

      const foundIds = maps.map((m) => m.id);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      for (const id of missingIds) {
        errorStack[id] = {
          message: `Map with id ${id} not found`,
          code: "MAP_NOT_FOUND",
        };
      }

      if (foundIds.length > 0) {
        await this.sequelize.destroy(foundIds, transaction);
      }

      for (const map of maps) {
        if (map.key) {
          try {
            await this.s3.delete(map.key);
          } catch (e) {
            errorStack[map.id] = {
              message: "S3 delete failed",
              code: "S3_ERROR",
            };
          }
        }
      }

      await this.sequelize.commitTransaction(transaction);

      return Object.keys(errorStack).length > 0
        ? { success: false, errors: errorStack }
        : { success: true };
    } catch (e) {
      await this.sequelize.rollbackTransaction(transaction);
      RethrowApiError(`Service error: Method - bulkDeletePersons`, e);
    }
  }

  /**
   * Updates s3 pdf file for article and updates record in DB
   * @param oldArticle
   * @param updatedArticle
   * @param pdfFile
   * @param transaction
   */
  private async updateMapFile(
    oldMap: Map,
    updatedMap: Map,
    file: Express.Multer.File,
    transaction: ExtendedTransaction,
  ) {
    const key = generateUuid();
    const buffer = await readFile(file.path);

    await this.s3.upload(key, buffer);
    await this.s3.delete(oldMap.key);

    await this.sequelize.update(updatedMap.id, { key: key }, transaction);
  }

  /**
   * Rollback for cleanup Create function changes
   * @param pdfKey
   * @param previewKey
   */
  private async safeCleanup(mapKey: string) {
    try {
      await this.s3.delete(mapKey);
    } catch {}
  }
}
