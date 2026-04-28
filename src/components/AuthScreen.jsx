import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import getFriendlyError from '../utils/friendlyError';

const teams = ['Leadership', 'Platform', 'Frontend', 'QA Guild'];

function AuthScreen({ initialError = '' }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    team: 'Platform',
    division: 'Platform',
    companyName: 'Sprintforge',
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await signup(form);
      }
    } catch (submitError) {
      setError(getFriendlyError(submitError, mode === 'login' ? 'Unable to log in.' : 'Unable to create your account.'));
    } finally {
      setLoading(false);
    }
  };

  const fieldClassName =
    'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition hover:border-gray-600 focus:ring-2 focus:ring-blue-500';
  const labelClassName = 'block space-y-1 text-sm text-gray-400';

  return (
    <div className="grid min-h-screen place-items-center bg-gray-950 p-4">
      <section className="grid w-full max-w-3xl gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-2xl shadow-black/20 lg:grid-cols-[1fr_0.95fr] lg:p-5">
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">Firebase Auth</p>
        <h1 className="mt-3 max-w-3xl text-lg font-semibold text-white">
          Login first. Open the dashboard by role after auth.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          Create a project manager or employee account with email and password. Sessions persist, and the private
          project dashboard only opens after successful authentication.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Project manager</p>
            <h2 className="mt-2 text-lg font-semibold text-white">Create workspaces</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Launch the project grid, open the create project modal, and manage the workspace list from the left
              sidebar.
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Employee</p>
            <h2 className="mt-2 text-lg font-semibold text-white">See accessible projects</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Sign in and land directly in the same modern project dashboard with the projects available to that user.
            </p>
          </div>
          </div>
        </div>

      <section className="rounded-xl border border-gray-800 bg-gray-950 p-5">
        <div className="inline-flex rounded-lg border border-gray-800 bg-gray-900 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${mode === 'login' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${mode === 'signup' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            Register
          </button>
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {mode === 'signup' ? (
            <label className={labelClassName}>
              Full name
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
                className={fieldClassName}
              />
            </label>
          ) : null}

          <label className={labelClassName}>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
              className={fieldClassName}
            />
          </label>

          <label className={labelClassName}>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              required
              className={fieldClassName}
            />
          </label>

          {mode === 'signup' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelClassName}>
                Role
                <select
                  value={form.role}
                  onChange={(event) => updateField('role', event.target.value)}
                  className={fieldClassName}
                >
                  <option className="text-slate-950" value="Project Manager">
                    Project Manager
                  </option>
                  <option className="text-slate-950" value="Employee">
                    Employee
                  </option>
                </select>
              </label>

              <label className={labelClassName}>
                Division
                <select
                  value={form.division}
                  onChange={(event) => {
                    updateField('division', event.target.value);
                    updateField('team', event.target.value);
                  }}
                  className={fieldClassName}
                >
                  {teams.map((team) => (
                    <option key={team} className="text-slate-950" value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          {mode === 'signup' ? (
            <label className={labelClassName}>
              Company name
              <input
                value={form.companyName}
                onChange={(event) => updateField('companyName', event.target.value)}
                required
                className={fieldClassName}
              />
            </label>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login to project dashboard' : 'Create account'}
          </button>
        </form>
      </section>
      </section>
    </div>
  );
}

export default AuthScreen;
