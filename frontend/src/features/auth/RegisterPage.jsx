import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getApiErrorMessage } from "../../services/api.js";

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
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="surface-card flex flex-col justify-between overflow-hidden p-8 lg:p-10">
          <div>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              to="/"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-brand-300" />
              Tutorials Forge
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-accent-200/80">
              Create Your Account
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Start a consistent learning flow across lessons, coding drills, and sandbox runs.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Registration unlocks the protected workspace, progress tracking, and the newer
              application shell across the rest of the platform.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <div className="soft-panel">
              <p className="text-sm font-semibold text-white">Guided study tracks</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Move through tutorials with language examples, objectives, and completion state.
              </p>
            </div>
            <div className="soft-panel">
              <p className="text-sm font-semibold text-white">Problem-first practice</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Filter challenges by difficulty, solve them in-editor, and keep local demo history.
              </p>
            </div>
            <div className="soft-panel">
              <p className="text-sm font-semibold text-white">Live code playground</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Work with multiple files, compiler metadata, and fast output feedback in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-card p-8 lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-200/80">
                Register
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Create your account</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your account is enough to unlock progress tracking and the protected app routes.
              </p>
            </div>
            <Link className="soft-button-secondary hidden sm:inline-flex" to="/login">
              Sign in
            </Link>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="form-input"
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

            <button className="soft-button-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Already have an account?{" "}
              <Link className="font-semibold text-white transition hover:text-accent-200" to="/login">
                Sign in
              </Link>
            </p>
            <p>Fallback demo data will still keep the workspace usable during API issues.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
