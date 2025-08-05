import { Container } from "inversify";
import { PersonServiceImpl } from "src/services/impl/person.service.impl";
import { TYPES } from "./types";
import { PersonServiceAbstract } from "src/services";
import { PersonControllerImpl } from "src/controllers/person.controller";
import { PersonRouter } from "src/routes/person.routes";
import { IndexRouter } from "src/routes";
import { DatabaseAbstract } from "src/types/abstractions";
import { DatabaseImpl } from "src/database/database.impl";
import { RewardServiceAbstract } from "src/services/abstraction/reward.service.abstraction";
import { RewardServiceImpl } from "src/services/impl/reward.service.impl";
import { RewardControllerImpl } from "src/controllers/reward.controller";
import { RewardRouter } from "src/routes/reward.routes";

const container = new Container()

container.bind<DatabaseAbstract>(TYPES.Sequelize).to(DatabaseImpl).inSingletonScope()

// Сервисы
container.bind<PersonServiceAbstract>(TYPES.PersonService).to(PersonServiceImpl).inSingletonScope()
container.bind<RewardServiceAbstract>(TYPES.RewardService).to(RewardServiceImpl).inSingletonScope()

// Контроллеры
container.bind<PersonControllerImpl>(TYPES.PersonController).to(PersonControllerImpl).inSingletonScope()
container.bind<RewardControllerImpl>(TYPES.RewardController).to(RewardControllerImpl).inSingletonScope()

// Роутеры
container.bind<PersonRouter>(TYPES.PersonRouter).to(PersonRouter).inSingletonScope()
container.bind<RewardRouter>(TYPES.RewardRouter).to(RewardRouter).inSingletonScope()
container.bind<IndexRouter>(TYPES.IndexRouter).to(IndexRouter).inSingletonScope()

export { container }