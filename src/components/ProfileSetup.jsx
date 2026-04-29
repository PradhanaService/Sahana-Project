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

  const fieldClassName = 'field-input';
  const labelClassName = 'block space-y-2 text-sm text-slate-600';

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <section className="app-shell w-full max-w-3xl p-5">
        <p className="eyebrow">Complete profile</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Finish your workspace access
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Your Firebase account is valid, but this workspace still needs your Firestore profile before it can open the
          dashboard.
        </p>

        <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Signed in as</p>
          <p className="mt-2 text-base font-medium text-slate-900">{email}</p>
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
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving profile...' : 'Create Firestore profile'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default ProfileSetup;
