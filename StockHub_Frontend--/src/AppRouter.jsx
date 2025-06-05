import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Layout/Layout";
import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import ForgetPassword from "./Pages/ForgetPassword";
import DashboardLayout from "./Layout/DashboardLayout";
import DashboardHome from "./Components/Dashboard/DashboardHome";
import MarketPage from "./Components/Dashboard/MarketPlace/MarketPage";
import NewsPage from "./Components/Dashboard/NewsPage";
import SettingsPage from "./Components/Dashboard/SettingsPage";
import ErrorPage from "./Pages/ErrorPage";
import PortfolioPage from "./Components/Dashboard/Portfolio/PortfolioPage";
import ContextProviderWrapper from "./Context/ContextProviderWrapper";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";

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
        <DashboardLayout />
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
        path: "news",
        element: <NewsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
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
    <ContextProviderWrapper>
      <RouterProvider router={routing} />
    </ContextProviderWrapper>
  );
};

export default AppRouter;
