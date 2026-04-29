import { UserPlus, Users } from 'lucide-react';

function ProjectTeamPanel({ activeProject, currentUser, users, saving, canManageProjects, onToggleMember }) {
  if (!activeProject) {
    return (
      <div className="panel p-6">
        <p className="eyebrow text-emerald-700">Team members</p>
        <p className="mt-4 text-sm text-slate-600">Select a project to manage who can receive assigned work.</p>
      </div>
    );
  }

  const candidateUsers = users
    .filter((user) => user.id !== currentUser.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-emerald-700">Team members</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Project access</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add teammates here first, then assign issues to them from the create issue flow.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-emerald-700">
          <Users size={18} />
        </div>
      </div>

      <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current access</p>
        <p className="mt-2 text-sm text-slate-900">
          {activeProject.memberIds?.length ?? 0} members can view this project and receive tasks.
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {candidateUsers.length ? (
          candidateUsers.map((user) => {
            const selected = activeProject.memberIds?.includes(user.id);

            return (
              <label
                key={user.id}
                className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition ${
                  selected ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white hover:border-slate-300'
                } ${canManageProjects ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
                    {user.role} | {user.division || user.team}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{user.companyName || 'Sprintforge'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selected ? (
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-700">
                      Added
                    </span>
                  ) : (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Not added
                    </span>
                  )}
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={!canManageProjects || saving}
                    onChange={() => onToggleMember(user.id, !selected)}
                    className="h-4 w-4 rounded border-slate-300 bg-white text-cyan-700 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </label>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
            No teammate profiles found yet. Ask team members to complete their workspace profile first.
          </div>
        )}
      </div>

      {canManageProjects ? (
        <div className="mt-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
          <UserPlus size={14} />
          {saving ? 'Saving team access...' : 'Toggle members to update project assignment access'}
        </div>
      ) : null}
    </div>
  );
}

export default ProjectTeamPanel;
