import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Profile from "./components/user-routes/Profile.jsx";
import AskDoubt from "./components/AskDoubt.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import QuizeMe from "./components/user-routes/QuizeMe.jsx";
import Community from "./components/user-routes/Community.jsx";
import QuizList from "./components/user-routes/QuizList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "ask-doubt",
        element: <AskDoubt />,
      },
      {
        path: "private",
        element: <PrivateRoute />,
        children: [
          {
            path: "ask-doubt",
            element: <AskDoubt />,
          },
          {
            path: "quize-me/:doubtId",
            element: <QuizeMe />,
          },
          {
            path:"quiz-list",
            element:<QuizList/>
          },
          {
            path: "community",
            element: <Community />,
          },
          {
            path: "community/:catId",
            element: <Community />,
          },

          {
            path: "user-profile", // <--- for logged-in user
            element: <Profile />,
          },
          {
            path: "user-profile/:userId", // <--- for public profile
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
