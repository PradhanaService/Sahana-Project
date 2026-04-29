function formatTimestamp(timestamp) {
  if (!timestamp?.seconds) {
    return 'Pending';
  }

  return new Date(timestamp.seconds * 1000).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function IssueReviewPanel({
  activeIssue,
  assignee,
  currentUser,
  canConfirm,
  onToggleMemberCompletion,
  onToggleManagerConfirmation,
}) {
  if (!activeIssue) {
    return (
      <section className="panel p-5">
        <p className="eyebrow text-emerald-700">Task review</p>
        <div className="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
          Select an issue to review member completion and project manager confirmation.
        </div>
      </section>
    );
  }

  const isAssignee = activeIssue.assigneeId === currentUser.id;
  const memberReportedDone = Boolean(activeIssue.memberReportedDone);
  const managerConfirmedDone = Boolean(activeIssue.managerConfirmedDone);
  const canMemberToggle = isAssignee && !canConfirm && !managerConfirmedDone;
  const canManagerToggle = canConfirm && memberReportedDone;

  return (
    <section className="panel p-5">
      <div>
        <p className="eyebrow text-emerald-700">Task review</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Completion workflow</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Members can report finished work here, then a project manager can confirm the task is actually done.
        </p>
      </div>

      <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{activeIssue.code}</p>
        <h3 className="mt-1 text-base font-semibold text-slate-900">{activeIssue.title}</h3>
        <p className="mt-2 text-sm text-slate-600">Assigned to {assignee?.name ?? 'Unassigned teammate'}</p>
      </div>

      <div className="mt-4 space-y-3">
        <label
          className={`flex items-start justify-between gap-3 rounded-xl border px-3 py-3 ${
            memberReportedDone ? 'border-cyan-200 bg-cyan-50' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Member reported completed</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {isAssignee
                ? 'Tick this after you finish the task so the project manager can review it.'
                : 'The assigned teammate uses this checkbox to report the task as completed.'}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-slate-500">
              Reported at {formatTimestamp(activeIssue.memberReportedDoneAt)}
            </p>
          </div>
          <input
            type="checkbox"
            checked={memberReportedDone}
            disabled={!canMemberToggle}
            onChange={(event) => onToggleMemberCompletion(activeIssue, event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 bg-white text-cyan-700 focus:ring-2 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <label
          className={`flex items-start justify-between gap-3 rounded-xl border px-3 py-3 ${
            managerConfirmedDone ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Project manager confirmed done</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {canConfirm
                ? 'Confirm the task here after checking the member update and reviewing the completed work.'
                : 'A project manager confirms this after reviewing the task.'}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-slate-500">
              Confirmed at {formatTimestamp(activeIssue.managerConfirmedDoneAt)}
            </p>
          </div>
          <input
            type="checkbox"
            checked={managerConfirmedDone}
            disabled={!canManagerToggle && !(canConfirm && managerConfirmedDone)}
            onChange={(event) => onToggleManagerConfirmation(activeIssue, event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 bg-white text-emerald-700 focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
      </div>
    </section>
  );
}

export default IssueReviewPanel;
