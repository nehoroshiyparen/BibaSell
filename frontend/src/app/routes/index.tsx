import { createBrowserRouter } from 'react-router-dom'
import { appRoutes } from './config/routes.config'
import RouteWrapper from './RouteWrapper'

export const router = createBrowserRouter(
    appRoutes.map(route => ({
        path: route.path,
        element: <RouteWrapper route={route}><route.element /></RouteWrapper>
    }))
)