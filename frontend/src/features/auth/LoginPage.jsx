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
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card flex flex-col justify-between p-8 lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              SF Tutorial
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900">
              Learn, practice, and execute code in one focused workspace.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-500">
              Tutorials, a live playground, guided problems, and progress tracking in a single
              clean dashboard.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-peach-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Tutorials</p>
              <p className="mt-2 text-sm text-slate-500">Start with guided lessons and code examples.</p>
            </div>
            <div className="rounded-2xl bg-mint-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Playground</p>
              <p className="mt-2 text-sm text-slate-500">Run JavaScript code and inspect output instantly.</p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Progress</p>
              <p className="mt-2 text-sm text-slate-500">Track solved problems and completed lessons.</p>
            </div>
          </div>
        </div>

        <div className="surface-card p-8 lg:p-10">
          <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">
            Use your account to continue where you left off.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600" htmlFor="email">
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
              <label className="mb-2 block text-sm font-medium text-slate-600" htmlFor="password">
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
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
            ) : null}

            <button className="soft-button-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            New here?{" "}
            <Link className="font-semibold text-slate-900" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
