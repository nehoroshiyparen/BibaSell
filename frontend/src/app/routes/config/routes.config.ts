import type { ComponentType } from "react";
import MainLayout from "../../layouts/main.layout";
import LoadingScreen from "src/shared/ui/LoadingScreen/LoadingScreen";
import CatSpinner from "src/shared/ui/Spinners/cat.spinner";
import Home from "src/pages/Home/Home";
import PersonFeedPage from "src/pages/Person/PersonFeed/PersonFeedPage";
import PersonPage from "src/pages/Person/PersonPage/PersonPage";
import RewardFeedPage from "src/pages/Reward/RewardFeed/RewardFeedPage";
import RewardPage from "src/pages/Reward/RewardPage/RewardPage";
import ArticleFeedPage from "src/pages/Article/ArticleFeed/ArtcileFeedPage";
import ArticlePage from "src/pages/Article/ArticlePage/ArticlePage";
import Header from "src/widgets/Header/ui/Header";
import Footer from "src/widgets/Footer/Footer";
import ArticleHeader from "src/widgets/ArticleHeader/ArticleHeader";
import MapFeedPage from "src/pages/Map/MapPage";

export interface LayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export type AppRoute = {
    layout: ComponentType<LayoutProps>,
    header: ComponentType<any>,
    footer: ComponentType<any>,
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
        header: Header,
        footer: Footer,
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
        header: Header,
        footer: Footer,
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
        header: Header,
        footer: Footer,
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
        header: Header,
        footer: Footer,
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
        header: Header,
        footer: Footer,
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
        header: Header,
        footer: Footer,
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
    {
        layout: MainLayout,
        header: ArticleHeader,
        footer: Footer,
        loader: {
            loadingScreen: LoadingScreen,
            spinner: {
                component: CatSpinner,
                width: 200,
                height: 200,
            },
        },
        path: '/articles/:slug',
        element: ArticlePage,
        protected: false
    },
    {
        layout: MainLayout,
        header: Header,
        footer: Footer,
        loader: {
            loadingScreen: LoadingScreen,
            spinner: {
                component: CatSpinner,
                width: 200,
                height: 200,
            },
        },
        path: '/maps',
        element: MapFeedPage,
        protected: false
    }
]