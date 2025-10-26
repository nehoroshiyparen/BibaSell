import type { ComponentType } from "react";
import MainLayout from "../../layouts/main.layout";
import LoadingScreen from "src/shared/ui/LoadingScreen/LoadingScreen";
import CatSpinner from "src/shared/ui/Spinners/cat.spinner";
import Home from "src/pages/Home/Home";
import PersonFeedPage from "src/pages/Person/PersonFeed/PersonFeedPage";
import PersonPage from "src/pages/Person/PersonPage/PersonPage";
import RewardFeedPage from "src/pages/Reward/RewardFeed/RewardFeedPage";
import RewardPage from "src/pages/Reward/RewardPage/RewardPage";
import ArticleFeedPage from "src/pages/Article/ArtcileFeedPage";

export type AppRoute = {
    layout: ComponentType<{ children: React.ReactElement }>,
    loader: {
        loadingScreen: ComponentType<{ spinner: React.ReactElement, show: boolean }>,
        spinner: {
            component: ComponentType<{ width: number, height: number }>,
            width: number,
            height: number,
        },
    },
    path: string,
    element: ComponentType,
    protected: boolean,
}

export const appRoutes: AppRoute[] = [
    {
        layout: MainLayout,
        loader: {
            loadingScreen: LoadingScreen,
            spinner: {
                component: CatSpinner,
                width: 200,
                height: 200,
            },
        },
        path: '/',
        element: Home,
        protected: false
    },
    {
        layout: MainLayout,
        loader: {
            loadingScreen: LoadingScreen,
            spinner: {
                component: CatSpinner,
                width: 200,
                height: 200,
            },
        },
        path: '/persons',
        element: PersonFeedPage,
        protected: false
    },
    {
        layout: MainLayout,
        loader: {
            loadingScreen: LoadingScreen,
            spinner: {
                component: CatSpinner,
                width: 200,
                height: 200,
            },
        },
        path: '/persons/:slug',
        element: PersonPage,
        protected: false
    },
    {
        layout: MainLayout,
        loader: {
            loadingScreen: LoadingScreen,
            spinner: {
                component: CatSpinner,
                width: 200,
                height: 200,
            },
        },
        path: '/rewards',
        element: RewardFeedPage,
        protected: false
    },
    {
        layout: MainLayout,
        loader: {
            loadingScreen: LoadingScreen,
            spinner: {
                component: CatSpinner,
                width: 200,
                height: 200,
            },
        },
        path: '/rewards/:slug',
        element: RewardPage,
        protected: false
    },
    {
        layout: MainLayout,
        loader: {
            loadingScreen: LoadingScreen,
            spinner: {
                component: CatSpinner,
                width: 200,
                height: 200,
            },
        },
        path: '/articles',
        element: ArticleFeedPage,
        protected: false
    },
]