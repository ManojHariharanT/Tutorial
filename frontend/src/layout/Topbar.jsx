import { useMemo, useState } from "react";
import Button from "../components/ui/Button.jsx";
import { mockNotifications } from "../config/mockContent.js";
import { useAuth } from "../hooks/useAuth.js";

const Topbar = ({ currentPage, onMenuClick, onCommandOpen }) => {
  const { user, isAuthenticated } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const initials = useMemo(() => {
    const source = user?.name || "Demo Learner";
    return source
      .split(" ")
      .slice(0, 2)
      .map((value) => value[0])
      .join("")
      .toUpperCase();
  }, [user?.name]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-surface-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-4 sm:px-6 xl:px-8">
        <Button className="md:hidden" onClick={onMenuClick} size="sm" variant="secondary">
          Menu
        </Button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {currentPage?.label || "Workspace"}
          </p>
          <p className="mt-1 truncate text-sm text-slate-400">
            {currentPage?.description ||
              "Browse content, run code, and track progress from the same platform shell."}
          </p>
        </div>

        <div className="hidden min-w-[320px] flex-1 lg:block">
          <button
            className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-surface-850/78 px-4 py-3 text-left transition duration-200 hover:border-accent-400/40"
            onClick={onCommandOpen}
            type="button"
          >
            <span className="text-sm text-slate-500">K</span>
            <span className="flex-1 text-sm text-slate-500">
              Search tutorials, problems, tools...
            </span>
            <span className="text-xs font-medium text-slate-500">Ctrl K</span>
          </button>
        </div>

        <div className="relative">
          <Button
            aria-label="Notifications"
            onClick={() => setIsNotificationsOpen((current) => !current)}
            size="sm"
            variant="secondary"
          >
            Notifications
          </Button>

          {isNotificationsOpen ? (
            <div className="absolute right-0 mt-3 w-[340px] rounded-[28px] border border-white/10 bg-surface-900/96 p-3 shadow-panel">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl px-3 py-3 transition hover:bg-white/5"
                >
                  <p className="text-sm font-semibold text-white">{notification.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{notification.body}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <button
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
          onClick={onCommandOpen}
          type="button"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-brand-400 text-sm font-semibold text-surface-950">
            {initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold text-white">
              {user?.name || "Demo Learner"}
            </span>
            <span className="block text-xs text-slate-500">
              {isAuthenticated ? "Connected profile" : "Local preview mode"}
            </span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
