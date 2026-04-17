import { NavLink } from "react-router-dom";
import navigation from "../config/navigation.js";
import { useAuth } from "../hooks/useAuth.js";

const icons = {
  dashboard: (
    <path
      d="M4 6.75A2.75 2.75 0 0 1 6.75 4h3.5A2.75 2.75 0 0 1 13 6.75v3.5A2.75 2.75 0 0 1 10.25 13h-3.5A2.75 2.75 0 0 1 4 10.25zm9 0A2.75 2.75 0 0 1 15.75 4h3.5A2.75 2.75 0 0 1 22 6.75v3.5A2.75 2.75 0 0 1 19.25 13h-3.5A2.75 2.75 0 0 1 13 10.25zm-9 9A2.75 2.75 0 0 1 6.75 13h3.5A2.75 2.75 0 0 1 13 15.75v3.5A2.75 2.75 0 0 1 10.25 22h-3.5A2.75 2.75 0 0 1 4 19.25zm11.25-2.75a.75.75 0 0 0-.75.75v8.5a.75.75 0 0 0 1.5 0v-8.5a.75.75 0 0 0-.75-.75m4.5 3a.75.75 0 0 0-.75.75v5.5a.75.75 0 0 0 1.5 0v-5.5a.75.75 0 0 0-.75-.75"
      fill="currentColor"
    />
  ),
  book: (
    <path
      d="M6.5 5A3.5 3.5 0 0 0 3 8.5v8A3.5 3.5 0 0 0 6.5 20H20a1 1 0 1 0 0-2H6.5A1.5 1.5 0 0 1 5 16.5V16h13.25A2.75 2.75 0 0 0 21 13.25v-6.5A2.75 2.75 0 0 0 18.25 4H6.5Zm.5 2h11a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-.75.75H7Z"
      fill="currentColor"
    />
  ),
  code: (
    <path
      d="M8.2 7.3a1 1 0 0 1 0 1.4L4.9 12l3.3 3.3a1 1 0 1 1-1.4 1.4L2.8 12.7a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4 0m7.6 0a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4l3.3-3.3-3.3-3.3a1 1 0 0 1 0-1.4m-2.12-2.06a1 1 0 0 1 .72 1.22l-3.2 12a1 1 0 0 1-1.94-.52l3.2-12a1 1 0 0 1 1.22-.7"
      fill="currentColor"
    />
  ),
  terminal: (
    <path
      d="M5.75 4A2.75 2.75 0 0 0 3 6.75v10.5A2.75 2.75 0 0 0 5.75 20h12.5A2.75 2.75 0 0 0 21 17.25V6.75A2.75 2.75 0 0 0 18.25 4Zm1.1 5.2a1 1 0 1 1 1.3-1.52l2.4 2.05a1.65 1.65 0 0 1 0 2.54l-2.4 2.05a1 1 0 1 1-1.3-1.52L8.85 11Zm5.9 4.8a1 1 0 1 1 0-2h3.5a1 1 0 1 1 0 2Z"
      fill="currentColor"
    />
  ),
  tool: (
    <path
      d="M21.2 7.8a5.5 5.5 0 0 1-7.65 5.07l-6.13 6.13a2 2 0 0 1-2.83-2.83l6.13-6.13A5.5 5.5 0 1 1 21.2 7.8m-10.45.7a1.75 1.75 0 1 0-3.5 0 1.75 1.75 0 0 0 3.5 0"
      fill="currentColor"
    />
  ),
  chart: (
    <path
      d="M5.75 3A2.75 2.75 0 0 0 3 5.75v12.5A2.75 2.75 0 0 0 5.75 21h12.5A2.75 2.75 0 0 0 21 18.25V5.75A2.75 2.75 0 0 0 18.25 3Zm1 13a1 1 0 0 1-1-1v-3.5a1 1 0 1 1 2 0V15a1 1 0 0 1-1 1m5 0a1 1 0 0 1-1-1V9a1 1 0 1 1 2 0v6a1 1 0 0 1-1 1m5 0a1 1 0 0 1-1-1V6.5a1 1 0 1 1 2 0V15a1 1 0 0 1-1 1"
      fill="currentColor"
    />
  ),
};

const SidebarIcon = ({ icon }) => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
    {icons[icon]}
  </svg>
);

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const displayUser = user?.name || "Demo Learner";
  const displayEmail = user?.email || "workspace@local.demo";

  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-surface-950/80 backdrop-blur-sm transition md:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[288px] flex-col border-r border-white/10 bg-surface-950/92 px-5 py-6 backdrop-blur-xl transition md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-200/70">
              LearnOS
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-white">Engineer Workspace</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Tutorials, practice, runtime tools, and progress in one shell.
            </p>
          </div>
          <button className="soft-button-secondary md:hidden" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <nav className="mt-8 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"
              }
              onClick={onClose}
              to={item.path}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                      isActive ? "bg-white/12 text-white" : "bg-white/5 text-slate-400"
                    }`}
                  >
                    <SidebarIcon icon={item.icon} />
                  </span>
                  <span className="flex-1">
                    <span className="block">{item.label}</span>
                    <span className="mt-0.5 block text-xs font-normal text-slate-500">
                      {item.description}
                    </span>
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-accent-400/14 via-brand-400/10 to-transparent p-5">
            <p className="text-sm font-semibold text-white">Today&apos;s focus</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Finish one tutorial section, run one playground session, and ship one accepted
              solution.
            </p>
          </div>

          <div className="surface-card p-4">
            <p className="text-sm font-semibold text-white">{displayUser}</p>
            <p className="mt-1 text-sm text-slate-400">{displayEmail}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">
              {isAuthenticated ? "Connected account" : "Demo workspace"}
            </p>
            {isAuthenticated ? (
              <button className="soft-button-secondary mt-4 w-full" onClick={logout} type="button">
                Log out
              </button>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
