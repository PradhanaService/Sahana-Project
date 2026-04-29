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

  const fieldClassName = 'field-input';
  const labelClassName = 'block space-y-2 text-sm text-slate-600';

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <section className="app-shell grid w-full max-w-6xl gap-4 p-4 lg:grid-cols-[1.1fr_0.9fr] lg:p-5">
        <div className="panel overflow-hidden p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
              <span className="font-mono text-sm font-semibold">SF</span>
            </div>
            <div>
              <p className="eyebrow">Secure access</p>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Internal delivery console</p>
            </div>
          </div>
          <h1 className="mt-6 max-w-3xl text-3xl font-semibold text-slate-900">
            Project operations dashboard for modern IT teams.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Create a project manager or employee account with email and password. Sessions persist, and the private
            project dashboard only opens after successful authentication.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="panel-muted p-4">
            <p className="eyebrow">Project manager</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Control delivery workspaces</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Launch the project grid, open the create project modal, and manage the workspace list from the left
              sidebar.
            </p>
          </div>
          <div className="panel-muted p-4">
            <p className="eyebrow text-emerald-700">Employee</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Operate assigned tasks</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Sign in and land directly in the same modern project dashboard with the projects available to that user.
            </p>
          </div>
          </div>
        </div>

      <section className="panel p-6">
        <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${mode === 'login' ? 'bg-cyan-700 text-white' : 'text-slate-600 hover:bg-white'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${mode === 'signup' ? 'bg-cyan-700 text-white' : 'text-slate-600 hover:bg-white'}`}
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
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
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
