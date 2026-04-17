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
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-card p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Join SF Tutorial
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900">
            Build a learning streak with tutorials, practice, and code feedback.
          </h1>
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-white/80 p-5 shadow-soft">
              <p className="text-sm font-semibold text-slate-900">Production-ready structure</p>
              <p className="mt-1 text-sm text-slate-500">
                Feature-based frontend, modular backend, and a clean service layer.
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-5 shadow-soft">
              <p className="text-sm font-semibold text-slate-900">Practical coding workflow</p>
              <p className="mt-1 text-sm text-slate-500">
                Switch from reading tutorials to solving problems without context switching.
              </p>
            </div>
          </div>
        </div>

        <div className="surface-card p-8 lg:p-10">
          <h2 className="text-2xl font-semibold text-slate-900">Create your account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Registration is enough to unlock protected routes and progress tracking.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600" htmlFor="name">
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
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </div>

            {error ? (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
            ) : null}

            <button className="soft-button-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-semibold text-slate-900" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
