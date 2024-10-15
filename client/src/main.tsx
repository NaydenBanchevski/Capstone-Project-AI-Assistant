import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "./pages/dashboard/Dashboard.tsx";
import { Home } from "./pages/home/Home.tsx";
import SignInPage from "./pages/sign-in/SignIn.tsx";
import SignUpPage from "./pages/sign-up/SignUp.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <DashboardLayout /> },
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/sign-in", element: <SignInPage /> },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/sign-in/sso-callback",
    element: <SignInPage />,
  },
]);
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      appearance={{ baseTheme: "light" }}
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/dashboard"
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
);
