import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import CardLinks from './pages/Protected/CardLinks';
import Login from './pages/Auth/Login';
import Cards from './pages/Protected/Cards';
import CreateCardLink from './pages/Protected/CreateCardLink'
import CardListByCardLink from './pages/Protected/CardListByCardLink'
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
            <Navbar />
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/cards",
        element: (
          <PrivateRoute>
            <Navbar />
            <Cards />
          </PrivateRoute>
        ),
      },
      {
        path: "/cardlinks",
        element: (
          <PrivateRoute>
            <Navbar />
            <CardLinks />
          </PrivateRoute>
        ),
      },
      {
        path: "/createcardlink",
        element: (
          <PrivateRoute>
            <Navbar />
            <CreateCardLink />
          </PrivateRoute>
        ),
      },
      {
        path: "/verify/:uuid",
        element: (
          <PrivateRoute>
            <PaymentCard />
          </PrivateRoute>
        ),
      },
      {
        path: "/card-link/:cardLinkId/cards",
        element: (
          <PrivateRoute>
            <CardListByCardLink />
          </PrivateRoute>
        ),
      },
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Navbar />
            <Cards />
          </PrivateRoute>
        ),
      }
    ],
  }
]);

export default router;