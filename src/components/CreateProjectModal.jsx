import { useState } from 'react';

const buildInitialState = (currentUser) => ({
  name: '',
  key: '',
  description: '',
  team: currentUser?.division || currentUser?.team || 'Platform',
  division: currentUser?.division || currentUser?.team || 'Platform',
  companyName: currentUser?.companyName || 'Sprintforge',
  visibility: 'Private',
  memberIds: [],
});

function CreateProjectModal({ isOpen, onClose, onCreateProject, users, currentUser }) {
  const [form, setForm] = useState(buildInitialState(currentUser));
  const [submitting, setSubmitting] = useState(false);
  const fieldClassName =
    'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition hover:border-gray-600 focus:ring-2 focus:ring-blue-500';
  const labelClassName = 'space-y-1 text-sm text-gray-400';

  if (!isOpen) {
    return null;
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMember = (userId, checked) => {
    setForm((prev) => ({
      ...prev,
      memberIds: checked ? [...prev.memberIds, userId] : prev.memberIds.filter((id) => id !== userId),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onCreateProject({
        ...form,
        key: form.key.trim().toUpperCase(),
        name: form.name.trim(),
        description: form.description.trim(),
      });
      setForm(buildInitialState(currentUser));
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl shadow-black/50">
        <div className="border-b border-gray-800 px-5 py-4 sm:px-6">
          <p className="text-sm text-gray-400">Create Project</p>
          <h2 className="mt-1 text-lg font-semibold text-white">New project workspace</h2>
          <p className="mt-1 text-sm text-gray-500">
            Keep the form compact, pick the division, and choose which employees can receive tasks.
          </p>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
            <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelClassName}>
              Project name
              <input
                required
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className={fieldClassName}
                placeholder="Payments Revamp"
              />
            </label>
            <label className={labelClassName}>
              Project key
              <input
                required
                maxLength={6}
                value={form.key}
                onChange={(event) => updateField('key', event.target.value)}
                className={`${fieldClassName} uppercase`}
                placeholder="PAY"
              />
            </label>
          </div>

          <label className={`block ${labelClassName}`}>
            Description
            <textarea
              rows="3"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              className={`${fieldClassName} min-h-24 resize-y`}
              placeholder="Brief your team on the goal, scope, and release shape for this project."
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
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
                <option className="text-slate-950">Platform</option>
                <option className="text-slate-950">Frontend</option>
                <option className="text-slate-950">QA Guild</option>
                <option className="text-slate-950">Leadership</option>
              </select>
            </label>
            <label className={labelClassName}>
              Company
              <input
                value={form.companyName}
                onChange={(event) => updateField('companyName', event.target.value)}
                className={fieldClassName}
              />
            </label>
            <label className={`${labelClassName} sm:col-span-2`}>
              Visibility
              <select
                value={form.visibility}
                onChange={(event) => updateField('visibility', event.target.value)}
                className={fieldClassName}
              >
                <option className="text-slate-950">Private</option>
                <option className="text-slate-950">Shared</option>
                <option className="text-slate-950">Public</option>
              </select>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-lg font-semibold text-white">Team members</p>
              <p className="mt-1 text-sm text-gray-500">
                Choose who should receive tasks in this project. The project manager is added automatically.
              </p>
            </div>
            <div className="grid max-h-56 gap-2 overflow-y-auto rounded-xl border border-gray-800 bg-gray-950 p-3">
              {users
                .filter((user) => user.id !== currentUser?.id)
                .map((user) => {
                  const selected = form.memberIds.includes(user.id);

                  return (
                    <label
                      key={user.id}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition ${
                        selected
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                        <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-gray-500">
                          {user.role} | {user.division || user.team}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">{user.companyName || 'Sprintforge'}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(event) => toggleMember(user.id, event.target.checked)}
                        className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                  );
                })}
            </div>
          </div>
          </div>

          <div className="sticky bottom-0 border-t border-gray-800 bg-gray-900/95 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:border-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0"
              >
                {submitting ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
