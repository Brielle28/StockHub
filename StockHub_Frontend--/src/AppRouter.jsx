import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Layout/Layout";
import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import ForgetPassword from "./Pages/ForgetPassword";
import DashboardLayout from "./Layout/DashboardLayout";
import DashboardHome from "./Components/Dashboard/DashboardHome";
import MarketPage from "./Components/Dashboard/MarketPlace/MarketPage";
import ErrorPage from "./Pages/ErrorPage";
import PortfolioPage from "./Components/Dashboard/Portfolio/PortfolioPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import ContextProviderWrapper from "./Context/ContextProviderWrapper";
import AuthProvider from "./Context/AuthContext";
import Notifications from "./Components/Dashboard/Notifications";
import SharedPortfolioProvider from "./Context/PortfolioContext";

const routing = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signUp",
    element: (
      <PublicRoute>
        <Registration />
      </PublicRoute>
    ),
  },
  {
    path: "/forget-password",
    element: (
      <PublicRoute>
        <ForgetPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <SharedPortfolioProvider>
        <ContextProviderWrapper>
          <DashboardLayout />
        </ContextProviderWrapper>
        </SharedPortfolioProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // default dashboard route
        element: <DashboardHome />,
      },
      {
        path: "market",
        element: <MarketPage />,
      },
      {
        path: "portfolio",
        element: <PortfolioPage />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

const AppRouter = () => {
  return (
    <AuthProvider>
      <RouterProvider router={routing} />
    </AuthProvider>
  );
};

export default AppRouter;
