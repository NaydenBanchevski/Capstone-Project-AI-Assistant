import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { DashboardLayout } from "./pages/dashboard/Dashboard";
import { Home } from "./pages/home/Home";
import SignInPage from "./pages/sign-in/SignIn";
import SignUpPage from "./pages/sign-up/SignUp";
import { ClerkProvider } from "@clerk/clerk-react";
import { Resume } from "./pages/resume/Resume";
import { v4 as uuidV4 } from "uuid";
import { Chat } from "./pages/chat/Chat";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/sign-in", element: <SignInPage /> },
  {
    path: "/sign-up/sso-callback",
    element: <DashboardLayout />,
  },
  {
    path: "/sign-in/sso-callback",
    element: <DashboardLayout />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "resume/:id",
        element: <Resume />,
      },
      {
        path: "/dashboard/resume",
        element: <Navigate to={`/dashboard/resume/${uuidV4()}`} />,
      },
      {
        path: "chat/:id",
        element: <Chat />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    appearance={{ baseTheme: "light" }}
    publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
    afterSignOutUrl="/dashboard"
  >
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ClerkProvider>
);
