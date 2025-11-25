import { TYPES } from "#src/di/types.js";

export const ROUTES = [
    { path: '/persons', router: TYPES.PersonRouter },
    { path: '/rewards', router: TYPES.RewardRouter },
    { path: '/pdfArticles', router: TYPES.PdfArticleRouter },
    { path: '/upload', router: TYPES.UploadRouter },
]