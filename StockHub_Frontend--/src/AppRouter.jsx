import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Layout/Layout";
import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import ForgetPassword from "./Pages/ForgetPassword";
import DashboardLayout from "./Layout/DashboardLayout";
import DashboardHome from "./Components/Dashboard/DashboardHome";
import MarketPage from "./Components/Dashboard/MarketPlace/MarketPage";
import ErrorPage from "./Pages/404Page";
import PortfolioPage from "./Components/Dashboard/Portfolio/PortfolioPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import ContextProviderWrapper from "./Context/ContextProviderWrapper";
import AuthProvider from "./Context/AuthContext";
import Notifications from "./Components/Dashboard/Notifications";
import SharedPortfolioProvider from "./Context/PortfolioContext";
import ErrorBoundary from "./Components/ErrorBoundary";
import DeveloperErrorPage from "./Pages/DeveloperErrorPage";

const routing = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    ),
    errorElement: <DeveloperErrorPage />,
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
      <ErrorBoundary>
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      </ErrorBoundary>
    ),
    errorElement: <DeveloperErrorPage />,
  },
  {
    path: "/signUp",
    element: (
      <ErrorBoundary>
        <PublicRoute>
          <Registration />
        </PublicRoute>
      </ErrorBoundary>
    ),
    errorElement: <DeveloperErrorPage />,
  },
  {
    path: "/forget-password",
    element: (
      <ErrorBoundary>
        <PublicRoute>
          <ForgetPassword />
        </PublicRoute>
      </ErrorBoundary>
    ),
    errorElement: <DeveloperErrorPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <ContextProviderWrapper>
            <DashboardLayout />
          </ContextProviderWrapper>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <DeveloperErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary>
            <DashboardHome />
          </ErrorBoundary>
        ),
      },
      {
        path: "market",
        element: (
          <ErrorBoundary>
            <MarketPage />
          </ErrorBoundary>
        ),
      },
      {
        path: "portfolio",
        element: (
          <ErrorBoundary>
            <PortfolioPage />
          </ErrorBoundary>
        ),
      },
      {
        path: "notifications",
        element: (
          <ErrorBoundary>
            <Notifications />
          </ErrorBoundary>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
    errorElement: <DeveloperErrorPage />,
  },
]);

const AppRouter = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <RouterProvider router={routing} />
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default AppRouter;
