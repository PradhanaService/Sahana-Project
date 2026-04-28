import { useState } from 'react';

const teams = ['Leadership', 'Platform', 'Frontend', 'QA Guild'];

function ProfileSetup({ email, initialName, onSubmit, loading, error }) {
  const [form, setForm] = useState({
    name: initialName,
    role: 'Employee',
    team: 'Platform',
    division: 'Platform',
    companyName: 'Sprintforge',
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
  };

  const fieldClassName =
    'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition hover:border-gray-600 focus:ring-2 focus:ring-blue-500';
  const labelClassName = 'block space-y-1 text-sm text-gray-400';

  return (
    <div className="grid min-h-screen place-items-center bg-gray-950 p-4">
      <section className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-2xl shadow-black/20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">Complete Profile</p>
        <h1 className="mt-3 text-lg font-semibold text-white">
          Finish your workspace access
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          Your Firebase account is valid, but this workspace still needs your Firestore profile before it can open the
          dashboard.
        </p>

        <div className="mt-4 rounded-xl border border-gray-800 bg-gray-950 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Signed in as</p>
          <p className="mt-2 text-base font-medium text-white">{email}</p>
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <label className={labelClassName}>
            Full name
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              required
              className={fieldClassName}
            />
          </label>

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

          <label className={labelClassName}>
            Company name
            <input
              value={form.companyName}
              onChange={(event) => updateField('companyName', event.target.value)}
              required
              className={fieldClassName}
            />
          </label>

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
            {loading ? 'Saving profile...' : 'Create Firestore profile'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default ProfileSetup;
