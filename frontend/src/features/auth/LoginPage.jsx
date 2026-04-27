import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getApiErrorMessage } from "../../services/api.js";

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
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="surface-card flex flex-col justify-between overflow-hidden p-8 lg:p-10">
          <div>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              to="/"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-accent-300" />
              Tutorials Forge
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-accent-200/80">
              Return To Your Workspace
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Tutorials, practice, and live execution now share the same visual system.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Pick up where you left off with guided modules, sandbox runs, and tracked problem
              solving in one focused shell.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="soft-panel">
              <p className="text-sm font-semibold text-white">Tutorial library</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Structured lessons with runnable examples and clear learning objectives.
              </p>
            </div>
            <div className="soft-panel">
              <p className="text-sm font-semibold text-white">Workspace runtime</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Switch files, run snippets, and inspect output without leaving the session.
              </p>
            </div>
            <div className="soft-panel">
              <p className="text-sm font-semibold text-white">Progress memory</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Track completions, submissions, and streaks from the same account.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-card p-8 lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-200/80">
                Sign In
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Open your learning shell</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Use your account to continue tutorials, playground runs, and saved progress.
              </p>
            </div>
            <Link className="soft-button-secondary hidden sm:inline-flex" to="/register">
              Create account
            </Link>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="form-input"
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
                className="form-input"
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

            <button className="soft-button-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              New here?{" "}
              <Link className="font-semibold text-white transition hover:text-accent-200" to="/register">
                Create an account
              </Link>
            </p>
            <p>Demo mode still works if the backend is unavailable.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
