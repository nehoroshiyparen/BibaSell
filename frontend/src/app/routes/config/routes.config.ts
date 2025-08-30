import type { ComponentType } from "react";
import MainLayout from "../../layouts/main.layout";
import LoadingScreen from "src/shared/ui/LoadingScreen/LoadingScreen";
import CatSpinner from "src/shared/ui/Spinners/cat.spinner";
import Home from "src/pages/home/Home";

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
    }
]