export const TYPES = {
    // Core
    App: Symbol.for('App'),
    Database: Symbol.for('Database'),
    Redis: Symbol.for('Redis'),
    Elastic: Symbol.for('Elastic'),
    S3: Symbol.for('S3'),

    // Routers
    PersonRouter: Symbol.for('PersonRouter'),
    RewardRouter: Symbol.for('RewardRouter'),
    MDXArticleRouter: Symbol.for('MDXArticleRouter'),
    PdfArticleRouter: Symbol.for('PdfArticleRouter'),
    IndexRouter: Symbol.for('IndexRouter'),

    // Controllers
    PersonController: Symbol.for('PersonController'),
    RewardController: Symbol.for('RewardController'),
    MDXArticleController: Symbol.for('MDXArticleController'),
    PdfArticleController: Symbol.for('PdfArticleController'),

    // Services
    PersonService: Symbol.for('PersonService'),
    RewardService: Symbol.for('RewardService'),
    MDXArticleService: Symbol.for('MDXArticleService'),
    PdfArticleService: Symbol.for('PdfArticleService'),

    // S3 services
    S3PersonService: Symbol.for('S3PersonServiceImpl'),
    S3RewardService: Symbol.for('S3RewardServiceImpl'),
    S3PdfArticleService: Symbol.for('S3PdfArticleServiceImpl'),

    // Sequelize repositories
    PersonSequelizeRepo: Symbol.for('PersonSequelizeRepo'),
    RewardSequelizeRepo: Symbol.for('RewardSequelizeRepo'),
    PdfArticleSequelizeRepo: Symbol.for('PdfArticleSequelizeRepo'),

    // Elastic repositories
    PdfArticleElasticRepo: Symbol.for('PdfArticleElasticRepo'),

    // Loggers
    AppLogger: Symbol.for('Applogger'),
    StoreLogger: Symbol.for('StoreLogger'),

    SequelizeLogger: Symbol.for('SequelizeLogger'),
    ElasticLogger: Symbol.for('ElasticLogger'),
    RedisLogger: Symbol.for('RedisLogger'),
    S3Logger: Symbol.for('S3Logger'),
}