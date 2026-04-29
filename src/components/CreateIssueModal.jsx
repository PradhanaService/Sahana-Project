import { useMemo, useState } from 'react';

const initialState = {
  title: '',
  status: 'To Do',
  assigneeId: '',
};

function CreateIssueModal({ isOpen, onClose, onCreateIssue, activeProject, users }) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const fieldClassName = 'field-input';
  const labelClassName = 'space-y-1 text-sm text-slate-600';

  const projectUsers = useMemo(() => {
    if (!activeProject) {
      return [];
    }

    return users
      .filter((user) => activeProject.memberIds?.includes(user.id))
      .sort((left, right) => left.name.localeCompare(right.name));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/18 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <p className="text-sm text-slate-500">Create Issue</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Add issue</h2>
          <p className="mt-1 text-sm text-slate-600">
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

          <div className="border-t border-slate-200 bg-white/95 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary mt-4 w-full sm:mt-0"
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
