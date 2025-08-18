import { Container } from "inversify";
import { PersonServiceImpl } from "#src/services/person.service.impl.js";
import { TYPES } from "./types.js";
import { PersonServiceAbstract } from "#src/types/abstractions/services/person.service.abstraction.js";
import { PersonControllerImpl } from "#src/controllers/person.controller.js";
import { PersonRouter } from "#src/routes/person.routes.js";
import { IndexRouter } from "#src/routes/index.js";
import { AppAbstract, DatabaseAbstract } from "#src/types/abstractions/index.js";
import { DatabaseImpl } from "#src/database/database.impl.js";
import { RewardServiceAbstract } from "#src/types/abstractions/services/reward.service.abstraction.js";
import { RewardServiceImpl } from "#src/services/reward.service.impl.js";
import { RewardControllerImpl } from "#src/controllers/reward.controller.js";
import { RewardRouter } from "#src/routes/reward.routes.js";
import { AppImpl } from "#src/app.impl.js";
import { ArticleServiceAbstract } from "#src/types/abstractions/services/article.service.abstraction.js";
import { ArticleServiceImpl } from "#src/services/article.service.impl.js";
import { ArticleControllerImpl } from "#src/controllers/article.controller.js";
import { RedisAbstract } from "#src/types/abstractions/redis.abstraction.js";
import { RedisImpl } from "#src/redis/redis.impl.js";
import { ArticleRouter } from "#src/routes/article.routes.js";

const container = new Container()

container.bind<AppAbstract>(TYPES.App).to(AppImpl).inSingletonScope()
container.bind<DatabaseAbstract>(TYPES.Database).to(DatabaseImpl).inSingletonScope()
container.bind<RedisAbstract>(TYPES.Redis).to(RedisImpl).inSingletonScope()

// Сервисы
container.bind<PersonServiceAbstract>(TYPES.PersonService).to(PersonServiceImpl).inSingletonScope()
container.bind<RewardServiceAbstract>(TYPES.RewardService).to(RewardServiceImpl).inSingletonScope()
container.bind<ArticleServiceAbstract>(TYPES.ArticleService).to(ArticleServiceImpl).inSingletonScope()

// Контроллеры
container.bind<PersonControllerImpl>(TYPES.PersonController).to(PersonControllerImpl).inSingletonScope()
container.bind<RewardControllerImpl>(TYPES.RewardController).to(RewardControllerImpl).inSingletonScope()
container.bind<ArticleControllerImpl>(TYPES.ArticleController).to(ArticleControllerImpl).inSingletonScope()

// Роутеры
container.bind<PersonRouter>(TYPES.PersonRouter).to(PersonRouter).inSingletonScope()
container.bind<RewardRouter>(TYPES.RewardRouter).to(RewardRouter).inSingletonScope()
container.bind<ArticleRouter>(TYPES.ArticleRouter).to(ArticleRouter).inSingletonScope()
container.bind<IndexRouter>(TYPES.IndexRouter).to(IndexRouter).inSingletonScope()

export { container }