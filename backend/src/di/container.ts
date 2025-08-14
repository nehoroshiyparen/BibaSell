import { Container } from "inversify";
import { PersonServiceImpl } from "src/services/person.service.impl";
import { TYPES } from "./types";
import { PersonServiceAbstract } from "src/types/abstractions/services/person.service.abstraction";
import { PersonControllerImpl } from "src/controllers/person.controller";
import { PersonRouter } from "src/routes/person.routes";
import { IndexRouter } from "src/routes";
import { AppAbstract, DatabaseAbstract } from "src/types/abstractions";
import { DatabaseImpl } from "src/database/database.impl";
import { RewardServiceAbstract } from "src/types/abstractions/services/reward.service.abstraction";
import { RewardServiceImpl } from "src/services/reward.service.impl";
import { RewardControllerImpl } from "src/controllers/reward.controller";
import { RewardRouter } from "src/routes/reward.routes";
import { AppImpl } from "src/app.impl";
import { ArticleServiceAbstract } from "src/types/abstractions/services/article.service.abstraction";
import { ArticleServiceImpl } from "src/services/article.service.impl";
import { ArticleControllerImpl } from "src/controllers/article.controller";
import { RedisAbstract } from "src/types/abstractions/redis.abstraction";
import { RedisImpl } from "src/redis/redis.impl";
import { ArticleRouter } from "src/routes/article.routes";

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