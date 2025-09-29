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
import { IMDXArticleService } from "#src/types/contracts/services/mdxArticles/mdxArticle.service.interface.js";
import { MDXArticleServiceImpl } from "#src/modules/mdxArticles/services/mdxArticle.service.impl.js";
import { MDXArticleControllerImpl } from "#src/modules/mdxArticles/controllers/mdxArticle.controller.js";
import { IRedis } from "#src/types/contracts/core/redis.interface.js";
import { RedisImpl } from "#src/infrastructure/redis/redis.impl.js";
import { MDXArticleRouter } from "#src/routes/article.routes.js";

const container = new Container()

container.bind<IApp>(TYPES.App).to(AppImpl).inSingletonScope()
container.bind<IDatabase>(TYPES.Database).to(DatabaseImpl).inSingletonScope()
container.bind<IRedis>(TYPES.Redis).to(RedisImpl).inSingletonScope()

// Сервисы
container.bind<IPersonService>(TYPES.PersonService).to(PersonServiceImpl).inSingletonScope()
container.bind<IRewardService>(TYPES.RewardService).to(RewardServiceImpl).inSingletonScope()
container.bind<IMDXArticleService>(TYPES.MDXArticleService).to(MDXArticleServiceImpl).inSingletonScope()

// Контроллеры
container.bind<PersonControllerImpl>(TYPES.PersonController).to(PersonControllerImpl).inSingletonScope()
container.bind<RewardControllerImpl>(TYPES.RewardController).to(RewardControllerImpl).inSingletonScope()
container.bind<MDXArticleControllerImpl>(TYPES.MDXArticleController).to(MDXArticleControllerImpl).inSingletonScope()

// Роутеры
container.bind<PersonRouter>(TYPES.PersonRouter).to(PersonRouter).inSingletonScope()
container.bind<RewardRouter>(TYPES.RewardRouter).to(RewardRouter).inSingletonScope()
container.bind<MDXArticleRouter>(TYPES.MDXArticleRouter).to(MDXArticleRouter).inSingletonScope()
container.bind<IndexRouter>(TYPES.IndexRouter).to(IndexRouter).inSingletonScope()

export { container }