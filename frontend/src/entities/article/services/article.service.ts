import { store, type AppDispatch } from "src/app/store";
import { getArticleByIdApi } from "../api/get/getArticleById";
import { getArticlesApi } from "../api/get/getArticles";
import { pushArticles, setArticles } from "../model";

export const getArticleById = async (id: number, dispatch: AppDispatch) => {
    const fetchedArticle = await getArticleByIdApi(id)

    return fetchedArticle
}

export const getArticles = async (offset: number, limit: number) => {
    const state = store.getState()
    const articleState = state.article

    const fetchedArticles = await getArticlesApi(offset, limit)

    if (!articleState || articleState.articles.length === 0) {
        store.dispatch(setArticles(fetchedArticles))
    } else {
        store.dispatch(pushArticles(fetchedArticles))
    }
}