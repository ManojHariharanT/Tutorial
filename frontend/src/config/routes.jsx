import { Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage.jsx";
import RegisterPage from "../features/auth/RegisterPage.jsx";
import Dashboard from "../features/dashboard/Dashboard.jsx";
import GuestRoute from "../features/auth/GuestRoute.jsx";
import LandingPage from "../features/landing/LandingPage.jsx";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
import CompilerWorkspacePage from "../features/playground/CompilerWorkspacePage.jsx";
import TutorialArticlePage from "../features/tutorials/TutorialArticlePage.jsx";
import TutorialsCatalogPage from "../features/tutorials/TutorialsCatalogPage.jsx";
import DeveloperToolsPage from "../features/tools/DeveloperToolsPage.jsx";
import PracticeList from "../features/practice/PracticeList.jsx";
import ProblemDetail from "../features/practice/ProblemDetail.jsx";
import DashboardProgress from "../features/progress/DashboardProgress.jsx";
import MainLayout from "../layout/MainLayout.jsx";

const appRoutes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/playground",
    element: <CompilerWorkspacePage />,
  },
  {
    path: "/tutorials",
    element: <TutorialsCatalogPage />,
  },
  {
    path: "/tutorials/:id",
    element: <TutorialArticlePage />,
  },
  {
    path: "/tools",
    element: <DeveloperToolsPage />,
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/practice", element: <PracticeList /> },
      { path: "/practice/:id", element: <ProblemDetail /> },
      { path: "/progress", element: <DashboardProgress /> },
    ],
  },
  {
    path: "*",
    element: <Navigate replace to="/" />,
  },
];

export default appRoutes;
