import { lazy, Suspense } from "react";
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

const CodeDiffTool = lazy(() => import("../features/tools/CodeDiffTool.jsx"));
const JsonEditorTool = lazy(() => import("../features/tools/JsonEditorTool.jsx"));
const QrGeneratorTool = lazy(() => import("../features/tools/QrGeneratorTool.jsx"));
const RegexLabTool = lazy(() => import("../features/tools/RegexLabTool.jsx"));
const ResumeBuilderTool = lazy(() => import("../features/tools/ResumeBuilderTool.jsx"));
const WhiteboardTool = lazy(() => import("../features/tools/WhiteboardTool.jsx"));

const withToolFallback = (element) => (
  <Suspense
    fallback={
      <div className="page-shell">
        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-300">
            Loading tool...
          </div>
        </main>
      </div>
    }
  >
    {element}
  </Suspense>
);

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
    path: "/tools/json-editor",
    element: withToolFallback(<JsonEditorTool />),
  },
  {
    path: "/tools/regex-lab",
    element: withToolFallback(<RegexLabTool />),
  },
  {
    path: "/tools/code-diff",
    element: withToolFallback(<CodeDiffTool />),
  },
  {
    path: "/tools/qr-generator",
    element: withToolFallback(<QrGeneratorTool />),
  },
  {
    path: "/tools/whiteboard",
    element: withToolFallback(<WhiteboardTool />),
  },
  {
    path: "/tools/resume-builder",
    element: withToolFallback(<ResumeBuilderTool />),
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
