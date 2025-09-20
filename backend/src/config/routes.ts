import { TYPES } from "#src/di/types.js";

export const ROUTES = [
    { path: '/persons', router: TYPES.PersonRouter },
    { path: '/rewards', router: TYPES.RewardRouter },
    { path: '/mdxArticles', router: TYPES.MDXArticleRouter },
]