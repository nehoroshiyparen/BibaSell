import type { ComponentType } from "react";
import Test from "../../../widgets/test.widget";
import MainLayout from "../../layouts/main.layout";
import LoadingScreen from "src/widgets/LoadingScreen/LoadingScreen";
import CatSpinner from "src/shared/ui/spinners/cat.spinner";

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
        element: Test,
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
        path: '/pets',
        element: Test,
        protected: false
    }
]