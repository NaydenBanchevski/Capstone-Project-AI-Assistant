import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";
import { Nav } from "./components/Nav.tsx";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { DashboardDemo } from "./pages/dashboard/Dashboard.tsx";
import { Home } from "./pages/home/Home.tsx";

// Layout component to include Nav globally
const Layout = () => (
  <>
    <Nav />
    <Outlet /> {/* Render matching route components */}
  </>
);

const router = createBrowserRouter([
  {
    element: <Layout />, // Include Nav in every page
    children: [
      { path: "/", element: <Home /> },
      { path: "/dashboard", element: <DashboardDemo /> },
      { path: "/sign-up", element: <h1>Sign Up Page</h1> }, // Placeholder
      { path: "/sign-in", element: <h1>Sign In Page</h1> }, // Placeholder
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
