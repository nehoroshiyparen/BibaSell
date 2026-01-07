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
    PdfArticleRouter: Symbol.for('PdfArticleRouter'),
    IndexRouter: Symbol.for('IndexRouter'),
    UploadRouter: Symbol.for('UploadRouter'),
    SwaggerRouter: Symbol.for('SwaggerRouter'),

    // Controllers
    PersonController: Symbol.for('PersonController'),
    RewardController: Symbol.for('RewardController'),
    MDXArticleController: Symbol.for('MDXArticleController'),
    PdfArticleController: Symbol.for('PdfArticleController'),
    UploadControllerImpl: Symbol.for('UploadControllerImpl'),
    MapControllerImpl: Symbol.for('MapControllerImpl'),

    // Services
    PersonService: Symbol.for('PersonService'),
    RewardService: Symbol.for('RewardService'),
    PdfArticleService: Symbol.for('PdfArticleService'),
    UploadService: Symbol.for('UploadService'),
    MapService: Symbol.for('MapService'),

    // S3 services
    S3PersonService: Symbol.for('S3PersonServiceImpl'),
    S3RewardService: Symbol.for('S3RewardServiceImpl'),
    S3PdfArticleService: Symbol.for('S3PdfArticleServiceImpl'),
    S3MapService: Symbol.for('S3MapService'),

    // Sequelize repositories
    PersonSequelizeRepo: Symbol.for('PersonSequelizeRepo'),
    RewardSequelizeRepo: Symbol.for('RewardSequelizeRepo'),
    PdfArticleSequelizeRepo: Symbol.for('PdfArticleSequelizeRepo'),
    MapSequelizeRepo: Symbol.for('MapSequelizeRepo'),

    // Elastic repositories
    PdfArticleElasticRepo: Symbol.for('PdfArticleElasticRepo'),

    // Mappers
    PersonMapper: Symbol.for('PersonMapper'),
    RewardMapper: Symbol.for('RewardMapper'),
    PdfArticleMapper: Symbol.for('PdfArticleMapper'),
    MapMapper: Symbol.for('MapMapper'),

    // Loggers
    AppLogger: Symbol.for('Applogger'),
    StoreLogger: Symbol.for('StoreLogger'),

    SequelizeLogger: Symbol.for('SequelizeLogger'),
    ElasticLogger: Symbol.for('ElasticLogger'),
    RedisLogger: Symbol.for('RedisLogger'),
    S3Logger: Symbol.for('S3Logger'),
}