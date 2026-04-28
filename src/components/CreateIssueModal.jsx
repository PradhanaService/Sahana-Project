import { useMemo, useState } from 'react';

const initialState = {
  title: '',
  status: 'To Do',
  assigneeId: '',
};

function CreateIssueModal({ isOpen, onClose, onCreateIssue, activeProject, users }) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const fieldClassName =
    'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition hover:border-gray-600 focus:ring-2 focus:ring-blue-500';
  const labelClassName = 'space-y-1 text-sm text-gray-400';

  const projectUsers = useMemo(() => {
    if (!activeProject) {
      return [];
    }

    return users
      .filter((user) => activeProject.memberIds?.includes(user.id))
      .filter((user) => user.role === 'Employee')
      .filter((user) => !activeProject.companyName || (user.companyName || 'Sprintforge') === activeProject.companyName)
      .filter((user) => !activeProject.division || (user.division || user.team) === activeProject.division);
  }, [activeProject, users]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onCreateIssue({
        ...form,
        title: form.title.trim(),
      });
      setForm(initialState);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl shadow-black/50">
        <div className="border-b border-gray-800 px-5 py-4 sm:px-6">
          <p className="text-sm text-gray-400">Create Issue</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Add issue</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add a compact issue card to {activeProject ? activeProject.name : 'the selected project'}.
          </p>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="space-y-4 px-5 py-4 sm:px-6">
          <label className={`block ${labelClassName}`}>
            Issue title
            <input
              required
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className={fieldClassName}
              placeholder="Fix sprint summary alignment"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className={`block ${labelClassName}`}>
              Status
              <select
                value={form.status}
                onChange={(event) => updateField('status', event.target.value)}
                className={fieldClassName}
              >
                <option className="text-slate-950">To Do</option>
                <option className="text-slate-950">In Progress</option>
                <option className="text-slate-950">Done</option>
              </select>
            </label>
            <label className={`block ${labelClassName}`}>
              Assignee
              <select
                value={form.assigneeId}
                onChange={(event) => updateField('assigneeId', event.target.value)}
                className={fieldClassName}
              >
                <option className="text-slate-950" value="">
                  Unassigned
                </option>
                {projectUsers.map((user) => (
                  <option key={user.id} className="text-slate-950" value={user.id}>
                    {user.name} ({user.division || user.team})
                  </option>
                ))}
              </select>
            </label>
          </div>
          </div>

          <div className="border-t border-gray-800 bg-gray-900/95 px-5 py-4 sm:px-6">
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
                {submitting ? 'Creating...' : 'Create Issue'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateIssueModal;
