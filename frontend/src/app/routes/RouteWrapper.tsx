import { useNavigation } from "react-router-dom"
import { useAppSelector } from "../store/hooks"
import type { AppRoute } from "./config/routes.config"
import PrivateRoute from "./PrivateRoute"
import PublicRoute from "./PublicRoute"

type RouteWrapperProps = {
    route: AppRoute,
    children: React.ReactElement
}

const RouteWrapper = ({ route, children }: RouteWrapperProps) => {
    const Layout = route.layout
    const LoadingScreen = route.loader.loadingScreen
    const Spinner = route.loader.spinner.component

    const reduxLoadingState = useAppSelector((state) => state.loader.loading)
    const navigate = useNavigation()
    const isLoading = reduxLoadingState || navigate.state === 'loading'

    const content = route.protected ? (
        <PrivateRoute>
            {children}
        </PrivateRoute>
    ) : (
        <PublicRoute>
            {children}
        </PublicRoute>
    )

    return (
        <>
            <LoadingScreen
                spinner={<Spinner width={route.loader.spinner.width} height={route.loader.spinner.height}/>}
                show={isLoading}
            />
            <Layout>
                {content}
            </Layout>
        </>
    )
}

export default RouteWrapper