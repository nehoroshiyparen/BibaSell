import { Container } from "inversify";
import { PersonServiceImpl } from "#src/modules/persons/services/person.service.impl.js";
import { TYPES } from "./types.js";
import { IPersonService } from "#src/types/contracts/services/persons/person.service.interface.js";
import { PersonControllerImpl } from "#src/modules/persons/controllers/person.controller.js";
import { PersonRouter } from "#src/routes/person.routes.js";
import { IndexRouter } from "#src/routes/index.js";
import { IApp, IDatabase } from "#src/types/contracts/index.js";
import { DatabaseImpl } from "#src/infrastructure/sequelize/database.impl.js";
import { IRewardService } from "#src/types/contracts/services/rewards/reward.service.interface.js";
import { RewardServiceImpl } from "#src/modules/rewards/services/reward.service.impl.js";
import { RewardControllerImpl } from "#src/modules/rewards/controllers/reward.controller.js";
import { RewardRouter } from "#src/routes/reward.routes.js";
import { AppImpl } from "#src/app.impl.js";
import { IRedis } from "#src/types/contracts/core/redis.interface.js";
import { RedisImpl } from "#src/infrastructure/redis/redis.impl.js";
import { S3PdfArticleServiceImpl } from "#src/modules/pdfArticles/services/S3PdfArticle.service.impl.js";
import { PdfArticleSequelizeRepo } from "#src/modules/pdfArticles/repositories/pdfArticle.sequelize-repo.js";
import { PdfArticleElasticRepo } from "#src/modules/pdfArticles/repositories/pdfArticle.elastic-repo.js";
import { IElastic } from "#src/types/contracts/core/elastic.interface.js";
import { ElasticImpl } from "#src/infrastructure/elastic/elastic.impl.js";
import { IBaseS3Repo } from "#src/types/contracts/core/base.s3-repo.interface.js";
import { BaseS3Repo } from "#src/infrastructure/S3/base.s3-repo.js";
import { PdfArticleRouter } from "#src/routes/pdfArticle.routes.js";
import { PdfArticleControllerImpl } from "#src/modules/pdfArticles/controllers/pdfArticle.controller.js";
import { IPdfArticleService } from "#src/types/contracts/services/pdfArticles/pdfArticle.service.interface.js";
import { PdfArticleServiceImpl } from "#src/modules/pdfArticles/services/pdfArticle.service.impl.js";
import { S3RewardServiceImpl } from "#src/modules/rewards/services/S3Reward.service.impl.js";
import { S3PersonServiceImpl } from "#src/modules/persons/services/S3Person.service.impl.js";
import { PersonSequelizeRepo } from "#src/modules/persons/repositories/person.sequelize.repo.js";
import { RewardSequelizeRepo } from "#src/modules/rewards/repositories/reward.sequelize.repo.js";
import { Logger } from "#src/lib/logger/base.logger.js";
import { AppLogger } from "#src/lib/logger/instances/app.logger.js";
import { elasticLogger, redisLogger, s3Logger, sequelizeLogger, StoreLogger } from "#src/lib/logger/instances/store.logger.js";
import { PdfArticleMapper } from "#src/modules/pdfArticles/mappers/pdfArticle.mapper.js";
import { PersonMapper } from "#src/modules/persons/mappers/person.mapper.js";
import { RewardMapper } from "#src/modules/rewards/mappers/reward.mapper.js";

const container = new Container()

// Core
container.bind<IApp>(TYPES.App).to(AppImpl).inSingletonScope()
container.bind<IDatabase>(TYPES.Database).to(DatabaseImpl).inSingletonScope()
container.bind<IRedis>(TYPES.Redis).to(RedisImpl).inSingletonScope()
container.bind<IElastic>(TYPES.Elastic).to(ElasticImpl).inSingletonScope()
container.bind<IBaseS3Repo>(TYPES.S3).to(BaseS3Repo).inSingletonScope()

// Routers
container.bind<PersonRouter>(TYPES.PersonRouter).to(PersonRouter).inSingletonScope()
container.bind<RewardRouter>(TYPES.RewardRouter).to(RewardRouter).inSingletonScope()
container.bind<PdfArticleRouter>(TYPES.PdfArticleRouter).to(PdfArticleRouter).inSingletonScope()
container.bind<IndexRouter>(TYPES.IndexRouter).to(IndexRouter).inSingletonScope()

// Controllers
container.bind<PersonControllerImpl>(TYPES.PersonController).to(PersonControllerImpl).inSingletonScope()
container.bind<RewardControllerImpl>(TYPES.RewardController).to(RewardControllerImpl).inSingletonScope()
container.bind<PdfArticleControllerImpl>(TYPES.PdfArticleController).to(PdfArticleControllerImpl).inSingletonScope()

// Services
container.bind<IPersonService>(TYPES.PersonService).to(PersonServiceImpl).inSingletonScope()
container.bind<IRewardService>(TYPES.RewardService).to(RewardServiceImpl).inSingletonScope()
container.bind<IPdfArticleService>(TYPES.PdfArticleService).to(PdfArticleServiceImpl).inSingletonScope()

// S3 services
container.bind<S3PersonServiceImpl>(TYPES.S3PersonService).to(S3PersonServiceImpl).inSingletonScope()
container.bind<S3RewardServiceImpl>(TYPES.S3RewardService).to(S3RewardServiceImpl).inSingletonScope()
container.bind<S3PdfArticleServiceImpl>(TYPES.S3PdfArticleService).to(S3PdfArticleServiceImpl).inSingletonScope()

// Sequelize repositories
container.bind<PersonSequelizeRepo>(TYPES.PersonSequelizeRepo).to(PersonSequelizeRepo).inSingletonScope()
container.bind<RewardSequelizeRepo>(TYPES.RewardSequelizeRepo).to(RewardSequelizeRepo).inSingletonScope()
container.bind<PdfArticleSequelizeRepo>(TYPES.PdfArticleSequelizeRepo).to(PdfArticleSequelizeRepo).inSingletonScope()

// Elastic repositories
container.bind<PdfArticleElasticRepo>(TYPES.PdfArticleElasticRepo).to(PdfArticleElasticRepo).inSingletonScope()

// Helpers 
container.bind<PersonMapper>(TYPES.PersonMapper).to(PersonMapper).inSingletonScope()
container.bind<RewardMapper>(TYPES.RewardMapper).to(RewardMapper).inSingletonScope()
container.bind<PdfArticleMapper>(TYPES.PdfArticleMapper).to(PdfArticleMapper).inSingletonScope()

// Loggers
container.bind<Logger>(TYPES.AppLogger).to(AppLogger).inSingletonScope()

container.bind<Logger>(TYPES.SequelizeLogger).toConstantValue(sequelizeLogger)
container.bind<Logger>(TYPES.ElasticLogger).toConstantValue(elasticLogger)
container.bind<Logger>(TYPES.S3Logger).toConstantValue(s3Logger)
container.bind<Logger>(TYPES.RedisLogger).toConstantValue(redisLogger)

export { container }