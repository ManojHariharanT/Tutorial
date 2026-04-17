import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SearchCommand from "../components/shared/SearchCommand.jsx";
import navigation from "../config/navigation.js";
import { mockProblems, mockTools, mockTutorials } from "../config/mockContent.js";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsCommandOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentPage = useMemo(
    () =>
      navigation.find(
        (item) =>
          location.pathname === item.path ||
          (item.path !== "/dashboard" && location.pathname.startsWith(item.path)),
      ),
    [location.pathname],
  );

  const commandItems = useMemo(
    () => [
      ...navigation.map((item) => ({
        id: item.path,
        label: item.label,
        description: item.description,
        path: item.path,
        keywords: [item.shortLabel],
      })),
      ...mockTutorials.map((tutorial) => ({
        id: tutorial._id,
        label: tutorial.title,
        description: tutorial.description,
        path: `/tutorials/${tutorial._id}`,
        keywords: [tutorial.category, tutorial.track, ...(tutorial.tags || [])],
      })),
      ...mockProblems.map((problem) => ({
        id: problem._id,
        label: problem.title,
        description: `${problem.difficulty} problem in ${problem.category}`,
        path: `/practice/${problem._id}`,
        keywords: [problem.difficulty, problem.category, ...(problem.tags || [])],
      })),
      ...mockTools.map((tool) => ({
        id: tool.id,
        label: tool.name,
        description: tool.description,
        path: "/tools",
        keywords: [tool.category],
      })),
    ],
    [],
  );

  return (
    <div className="page-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen md:pl-[288px]">
        <Topbar
          currentPage={currentPage}
          onCommandOpen={() => setIsCommandOpen(true)}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 xl:px-8">
          <Outlet />
        </main>
      </div>

      <SearchCommand
        items={commandItems}
        onClose={() => setIsCommandOpen(false)}
        open={isCommandOpen}
      />
    </div>
  );
};

export default MainLayout;
