import { lazy, Suspense } from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from 'react-router-dom';
import { Spinner, Container } from 'react-bootstrap';

import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminRoute } from '../components/AdminRoute';

import PageLayout from '../pages/PageLayout';
import PageHome from '../pages/PageHome';
import Page404 from '../pages/Page404';
const PageMaps = lazy(() => import('../pages/PageMaps'));
const PageLogin = lazy(() => import('../pages/PageLogin'));
const PageRegister = lazy(() => import('../pages/PageRegister'));
const PageForgotPassword = lazy(() => import('../pages/PageForgotPassword'));
const PageHotels = lazy(() => import('../pages/PageHotels'));
const PageRestaurants = lazy(() => import('../pages/PageRestaurants'));
const PageTransports = lazy(() => import('../pages/PageTransports'));
const PageEntertainment = lazy(() => import('../pages/PageEntertainment'));
const PagePublicTrips = lazy(() => import('../pages/PagePublicTrips'));
const PagePublicTripDetail = lazy(
    () => import('../pages/PagePublicTripDetail'),
);
const PageUserDashboard = lazy(() => import('../pages/User/PageUserDashboard'));
const PageUserProfile = lazy(() => import('../pages/User/PageUserProfile'));
const PageUserFavorites = lazy(() => import('../pages/User/PageUserFavorites'));
const PageUserTrips = lazy(() => import('../pages/User/PageUserTrips'));
const PageUserTripDetail = lazy(
    () => import('../pages/User/PageUserTripDetail'),
);
const PageAdminPlaces = lazy(() => import('../pages/Admin/PageAdminPlaces'));

const PageFallback = () => (
    <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '60vh' }}
    >
        <Spinner animation="border" variant="primary" />
    </Container>
);

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<PageLayout />}
            // errorElement={<h1>Not found!</h1>}
        >
            <Route path="/" element={<PageHome />} />
            <Route
                element={
                    <Suspense fallback={<PageFallback />}>
                        <PageMaps />
                    </Suspense>
                }
                path="/map"
            />
            <Route
                element={
                    <Suspense fallback={<PageFallback />}>
                        <PageLogin />
                    </Suspense>
                }
                path="/login"
            />
            <Route
                element={
                    <Suspense fallback={<PageFallback />}>
                        <PageRegister />
                    </Suspense>
                }
                path="/register"
            />
            <Route
                element={
                    <Suspense fallback={<PageFallback />}>
                        <PageForgotPassword />
                    </Suspense>
                }
                path="/forgot-password"
            />
            <Route
                element={
                    <Suspense fallback={<PageFallback />}>
                        <PageHotels />
                    </Suspense>
                }
                path="/hotels"
            />
            <Route
                element={
                    <Suspense fallback={<PageFallback />}>
                        <PageRestaurants />
                    </Suspense>
                }
                path="/restaurants"
            />
            <Route
                element={
                    <Suspense fallback={<PageFallback />}>
                        <PageTransports />
                    </Suspense>
                }
                path="/transports"
            />
            <Route
                element={
                    <Suspense fallback={<PageFallback />}>
                        <PageEntertainment />
                    </Suspense>
                }
                path="/entertainment"
            />
            <Route
                element={
                    <Suspense fallback={<PageFallback />}>
                        <PagePublicTrips />
                    </Suspense>
                }
                path="/trips/public"
            />
            <Route
                element={
                    <Suspense fallback={<PageFallback />}>
                        <PagePublicTripDetail />
                    </Suspense>
                }
                path="/trips/public/:tripId"
            />
            <Route element={<ProtectedRoute />}>
                <Route
                    element={
                        <Suspense fallback={<PageFallback />}>
                            <PageUserDashboard />
                        </Suspense>
                    }
                    path="/user-dashboard"
                />
                <Route
                    element={
                        <Suspense fallback={<PageFallback />}>
                            <PageUserProfile />
                        </Suspense>
                    }
                    path="/user-profile"
                />
                <Route
                    element={
                        <Suspense fallback={<PageFallback />}>
                            <PageUserFavorites />
                        </Suspense>
                    }
                    path="/user-favorites"
                />
                <Route
                    element={
                        <Suspense fallback={<PageFallback />}>
                            <PageUserTrips />
                        </Suspense>
                    }
                    path="/trips"
                />
                <Route
                    element={
                        <Suspense fallback={<PageFallback />}>
                            <PageUserTripDetail />
                        </Suspense>
                    }
                    path="/trips/:tripId"
                />
            </Route>

            <Route element={<AdminRoute />}>
                <Route
                    element={
                        <Suspense fallback={<PageFallback />}>
                            <PageAdminPlaces />
                        </Suspense>
                    }
                    path="/admin/places"
                />
            </Route>
            <Route path="*" element={<Page404 />} />
        </Route>,
    ),
);
