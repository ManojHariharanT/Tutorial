import { Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage.jsx";
import RegisterPage from "../features/auth/RegisterPage.jsx";
import Dashboard from "../features/dashboard/Dashboard.jsx";
import GuestRoute from "../features/auth/GuestRoute.jsx";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
import Playground from "../features/playground/Playground.jsx";
import PracticeList from "../features/practice/PracticeList.jsx";
import ProblemDetail from "../features/practice/ProblemDetail.jsx";
import DashboardProgress from "../features/progress/DashboardProgress.jsx";
import ToolsGrid from "../features/tools/ToolsGrid.jsx";
import TutorialDetail from "../features/tutorials/TutorialDetail.jsx";
import TutorialsLibrary from "../features/tutorials/TutorialsLibrary.jsx";
import MainLayout from "../layout/MainLayout.jsx";

const appRoutes = [
  {
    path: "/",
    element: <Navigate replace to="/dashboard" />,
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
      { path: "/tutorials", element: <TutorialsLibrary /> },
      { path: "/tutorials/:id", element: <TutorialDetail /> },
      { path: "/practice", element: <PracticeList /> },
      { path: "/practice/:id", element: <ProblemDetail /> },
      { path: "/playground", element: <Playground /> },
      { path: "/tools", element: <ToolsGrid /> },
      { path: "/progress", element: <DashboardProgress /> },
    ],
  },
  {
    path: "*",
    element: <Navigate replace to="/dashboard" />,
  },
];

export default appRoutes;
