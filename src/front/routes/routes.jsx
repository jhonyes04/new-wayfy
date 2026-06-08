import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { PageLayout } from '../pages/PageLayout';
import { PageHome } from '../pages/PageHome'
import { PageMaps } from '../pages/PageMaps'
import { PageLogin } from '../pages/PageLogin'
import { PageRegister } from '../pages/PageRegister'
import { PageForgotPassword } from '../pages/PageForgotPassword'
import { PageHotels } from '../pages/PageHotels'
import { PageRestaurants } from '../pages/PageRestaurants'
import { PageTransports } from '../pages/PageTransports'
import { PageEntertainment } from '../pages/PageEntertainment'
import { ProtectedRoute } from '../components/ProtectedRoute';
import { PageUserDashboard } from '../pages/User/PageUserDashboard';
import { PageUserProfile } from '../pages/User/PageUserProfile';



export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<PageLayout />} errorElement={<h1>Not found!</h1>}>
      <Route path='/' element={<PageHome />} />
      <Route path="/map" element={<PageMaps />} />
      <Route path="/login" element={<PageLogin />} />
      <Route path="/register" element={<PageRegister />} />
      <Route path="/forgot-password" element={<PageForgotPassword />} />
      <Route path="/hotels" element={<PageHotels />} />
      <Route path="/restaurants" element={<PageRestaurants />} />
      <Route path="/transports" element={<PageTransports />} />
      <Route path="/entertainment" element={<PageEntertainment />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/user-dashboard" element={<PageUserDashboard />} />
        <Route path="/user-profile" element={<PageUserProfile />} />
      </Route>
    </Route>
  ),
);
