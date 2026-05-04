import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getApiErrorMessage } from "../../services/api.js";

const workspaceStats = [
  { label: "Lessons", value: "42" },
  { label: "Runs", value: "128" },
  { label: "Solved", value: "19" },
];

const loginBenefits = [
  {
    title: "Structured lessons",
    description: "Resume tutorials, code examples, and learning objectives from the same account.",
  },
  {
    title: "Runtime workspace",
    description: "Move between playground runs and practice submissions without losing context.",
  },
  {
    title: "Tracked progress",
    description: "Keep completions, streaks, and accepted solutions tied to your profile.",
  },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (submissionError) {
      setError(getApiErrorMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1500px] overflow-hidden rounded-[32px] border border-white/10 bg-surface-950/72 shadow-panel backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative overflow-hidden border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(69,173,255,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(15,143,255,0.14),transparent_24%),linear-gradient(180deg,rgba(11,17,32,0.16),rgba(11,17,32,0.72))]" />

          <div className="relative flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                className="inline-flex items-center gap-3 rounded-full border border-brand-300/25 bg-brand-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-100 transition hover:border-brand-200/40 hover:bg-brand-400/16 hover:text-white"
                to="/"
              >
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-brand-300" />
                SF Tutorial
              </Link>

              <div className="flex items-center gap-3">
                {workspaceStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-14 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-200/85">
                Sign In
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Step back into your coding workspace.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
                Continue tutorials, practice drills, and sandbox runs from one account-backed
                shell designed for focus.
              </p>
            </div>

            <div className="mt-12 grid gap-4 xl:grid-cols-3">
              {loginBenefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="rounded-[26px] border border-white/10 bg-surface-900/78 p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-400/14 text-sm font-semibold text-brand-100">
                      0{index + 1}
                    </span>
                    <p className="text-base font-semibold text-white">{benefit.title}</p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-400">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-12">
              <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 md:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Active workspace
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    Tutorials, playground, and problem solving stay in one loop.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                  <div className="rounded-2xl border border-white/10 bg-surface-850/84 px-4 py-3">
                    <p className="text-sm font-semibold text-white">JavaScript Foundations</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-brand-200/80">
                      In progress
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-surface-850/84 px-4 py-3">
                    <p className="text-sm font-semibold text-white">Two Sum</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-brand-200/80">
                      Ready to solve
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(37,99,235,0.06),transparent_22%)]" />

          <div className="relative w-full max-w-[540px] rounded-[30px] border border-white/10 bg-surface-900/92 p-8 shadow-panel backdrop-blur-xl sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-200/85">
                  Account Access
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Open your learning shell</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Use your account to sync progress, reopen practice work, and keep your workspace
                  history attached to one profile.
                </p>
              </div>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 transition hover:border-brand-300/30 hover:bg-brand-400/10 hover:text-white"
                to="/register"
              >
                Create account
              </Link>
            </div>

            <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="w-full rounded-2xl border border-white/10 bg-surface-850/92 px-4 py-4 text-base text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/12"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="w-full rounded-2xl border border-white/10 bg-surface-850/92 px-4 py-4 text-base text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/12"
                  type="password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}

              <button
                className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-base font-semibold text-white shadow-[0_18px_48px_rgba(15,143,255,0.28)] transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:grid-cols-2">
              <p>
                New here?{" "}
                <Link className="font-semibold text-white transition hover:text-brand-200" to="/register">
                  Create an account
                </Link>
              </p>
              <p>Demo mode still works if the backend is unavailable.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
