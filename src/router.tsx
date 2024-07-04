import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./app";
import { Login, Register } from "./modules/Auth/infrastructure";
import { Tasks } from "./modules/Tasks/infrastructure/TaskList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <h1>404 Not Found</h1>,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/",
        element: <Tasks />,
      },
    ],
  },
]);
