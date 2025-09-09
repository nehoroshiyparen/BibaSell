import { createBrowserRouter } from 'react-router-dom'
import { appRoutes } from './config/routes.config'
import RouteWrapper from './RouteWrapper'
import ScrollToTop from '../components/ScrollToTop'

export const router = createBrowserRouter(
    appRoutes.map(route => ({
        path: route.path,
        element: 
            <>
                <ScrollToTop />
                <RouteWrapper route={route}><route.element /></RouteWrapper>
            </>
    }))
)