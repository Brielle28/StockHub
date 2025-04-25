import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Layout/Layout";
import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import ForgetPassword from "./Pages/ForgetPassword";
import DashboardLayout from "./Layout/DashboardLayout";
import DashboardHome from "./Components/Dashboard/DashboardHome";
import MarketPage from "./Components/Dashboard/MarketPage";
import PortfolioPage from "./Components/Dashboard/PortfolioPage";
import NewsPage from "./Components/Dashboard/NewsPage";
import NotificationsPage from "./Components/Dashboard/NotificationsPage";
import SettingsPage from "./Components/Dashboard/SettingsPage";

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
    element: <LoginPage />,
  },
  {
    path: "/signUp",
    element: <Registration />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
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
        path: "notifications",
        element: <NotificationsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={routing} />;
};

export default AppRouter;
