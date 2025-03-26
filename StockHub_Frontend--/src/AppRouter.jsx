import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Layout/Layout";
import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import ForgetPassword from "./Pages/ForgetPassword";

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
]);
const AppRouter = () => {
  return (
    <>
      <RouterProvider router={routing} />
    </>
  );
};

export default AppRouter;
