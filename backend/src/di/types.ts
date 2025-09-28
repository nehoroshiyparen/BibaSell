export const TYPES = {
    // Core
    App: Symbol.for('App'),
    Database: Symbol.for('Database'),
    Redis: Symbol.for('Redis'),
    Elastic: Symbol.for('Elastic'),

    // Routers
    PersonRouter: Symbol.for('PersonRouter'),
    RewardRouter: Symbol.for('RewardRouter'),
    MDXArticleRouter: Symbol.for('MDXArticleRouter'),
    IndexRouter: Symbol.for('IndexRouter'),

    // Controllers
    PersonController: Symbol.for('PersonController'),
    RewardController: Symbol.for('RewardController'),
    MDXArticleController: Symbol.for('MDXArticleController'),

    // Services
    PersonService: Symbol.for('PersonService'),
    RewardService: Symbol.for('RewardService'),
    MDXArticleService: Symbol.for('MDXArticleService'),
    PdfArticleService: Symbol.for('PdfArticleService'),

    // Sequelize repositories
    PdfArticleSequelizeRepo: Symbol.for('PdfArticleSequelizeRepo'),

    // Elastic repositories
    PdfArticleElasticRepo: Symbol.for('PdfArticleElasticRepo'),
}