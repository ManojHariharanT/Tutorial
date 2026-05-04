import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getApiErrorMessage } from "../../services/api.js";

const registerHighlights = [
  {
    value: "3",
    label: "Workspaces",
    helper: "Tutorials, practice, and playground all unlock at once.",
  },
  {
    value: "1",
    label: "Profile",
    helper: "Progress, submissions, and recent activity stay attached to one account.",
  },
  {
    value: "24/7",
    label: "Access",
    helper: "Fallback demo data keeps the app usable during partial backend setup.",
  },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
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
      await register(formData);
      navigate("/dashboard");
    } catch (submissionError) {
      setError(getApiErrorMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1500px] overflow-hidden rounded-[32px] border border-white/10 bg-surface-950/72 shadow-panel backdrop-blur-xl lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative flex items-center justify-center border-b border-white/10 p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(37,99,235,0.06),transparent_22%)]" />

          <div className="relative w-full max-w-[560px] rounded-[30px] border border-white/10 bg-surface-900/92 p-8 shadow-panel backdrop-blur-xl sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-200/85">
                  Register
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Create your account</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Start a profile for tutorials, coding drills, and sandbox runs in the same
                  product shell.
                </p>
              </div>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-100 transition hover:border-brand-300/30 hover:bg-brand-400/10 hover:text-white"
                to="/login"
              >
                Sign in
              </Link>
            </div>

            <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className="w-full rounded-2xl border border-white/10 bg-surface-850/92 px-4 py-4 text-base text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/12"
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Your full name"
                  required
                />
              </div>

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
                  placeholder="Minimum 6 characters"
                  minLength={6}
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
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:grid-cols-2">
              <p>
                Already have an account?{" "}
                <Link className="font-semibold text-white transition hover:text-brand-200" to="/login">
                  Sign in
                </Link>
              </p>
              <p>Fallback demo data will still keep the workspace usable during API issues.</p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden p-8 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(69,173,255,0.2),transparent_28%),radial-gradient(circle_at_20%_20%,rgba(15,143,255,0.12),transparent_24%),linear-gradient(180deg,rgba(11,17,32,0.12),rgba(11,17,32,0.72))]" />

          <div className="relative flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                className="inline-flex items-center gap-3 rounded-full border border-brand-300/25 bg-brand-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-100 transition hover:border-brand-200/40 hover:bg-brand-400/16 hover:text-white"
                to="/"
              >
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-brand-300" />
                SF Tutorial
              </Link>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Protected workspace
                </p>
                <p className="mt-1 text-lg font-semibold text-white">Ready after signup</p>
              </div>
            </div>

            <div className="mt-14 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-200/85">
                Account Setup
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Build one home for learning, coding, and progress.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
                Register once and use the same identity across guided lessons, evaluated problems,
                and the live sandbox workspace.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {registerHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[26px] border border-white/10 bg-surface-900/78 p-5"
                >
                  <p className="text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-200/80">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{item.helper}</p>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-12">
              <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[24px] border border-brand-400/14 bg-brand-400/8 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200/80">
                    First session
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    Sign up, open the dashboard, then jump into tutorials or practice.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                  <div className="rounded-2xl border border-white/10 bg-surface-850/84 px-4 py-3">
                    <p className="text-sm font-semibold text-white">Tutorial path</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                      Multi-language examples
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-surface-850/84 px-4 py-3">
                    <p className="text-sm font-semibold text-white">Practice queue</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                      Search and difficulty filters
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-surface-850/84 px-4 py-3">
                    <p className="text-sm font-semibold text-white">Playground</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                      Run code and inspect output
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
