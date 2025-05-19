import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import CardLinks from './pages/Protected/CardLinks';
import Login from './pages/Auth/Login';
import Cards from './pages/Protected/Cards';
import PaymentCard from './pages/Protected/PaymentCard';
import PrivateRoute from './routers/PrivateRoute';
import PublicRoute from './routers/PublicRoute';
import Layout from './components/layout';

export const router = createBrowserRouter([
  {
        element: <Layout />,
        children: [
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/cards",
        element: (
          <PrivateRoute>
            <Cards />
          </PrivateRoute>
        ),
      },
      {
        path: "/cardlinks",
        element: (
          <PrivateRoute>
            <CardLinks />
          </PrivateRoute>
        ),
      },
      {
        path: "/test",
        element: (
          <PrivateRoute>
            <PaymentCard />
          </PrivateRoute>
        ),
      },
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Cards />
          </PrivateRoute>
        ),
      }
    ],
  }
]);

export default router;