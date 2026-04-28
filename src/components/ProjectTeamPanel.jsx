import { UserPlus, Users } from 'lucide-react';

function ProjectTeamPanel({ activeProject, currentUser, users, saving, canManageProjects, onToggleMember }) {
  if (!activeProject) {
    return (
      <div className="rounded-[30px] border border-white/10 bg-slate-950/60 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Team Members</p>
        <p className="mt-4 text-sm text-slate-400">Select a project to manage who can receive assigned work.</p>
      </div>
    );
  }

  const candidateUsers = users
    .filter((user) => user.id !== currentUser.id)
    .filter((user) => user.role === 'Employee')
    .filter((user) => !activeProject.companyName || (user.companyName || 'Sprintforge') === activeProject.companyName)
    .filter((user) => !activeProject.division || (user.division || user.team) === activeProject.division)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Team Members</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Project access</h3>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Add teammates here first, then assign issues to them from the create issue flow.
          </p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-800 p-2.5 text-emerald-300">
          <Users size={18} />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-gray-800 bg-gray-800 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Current access</p>
        <p className="mt-2 text-sm text-white">
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
                  selected ? 'border-blue-500 bg-blue-900/30' : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                } ${canManageProjects ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-gray-500">
                    {user.role} | {user.division || user.team}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{user.companyName || 'Sprintforge'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selected ? (
                    <span className="rounded-full border border-blue-500/40 bg-blue-900/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200">
                      Added
                    </span>
                  ) : (
                    <span className="rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                      Not added
                    </span>
                  )}
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={!canManageProjects || saving}
                    onChange={() => onToggleMember(user.id, !selected)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </label>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed border-gray-800 bg-gray-950 p-4 text-center text-sm text-gray-500">
            No teammate profiles found yet. Ask team members to complete their workspace profile first.
          </div>
        )}
      </div>

      {canManageProjects ? (
        <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-gray-500">
          <UserPlus size={14} />
          {saving ? 'Saving team access...' : 'Toggle members to update project assignment access'}
        </div>
      ) : null}
    </div>
  );
}

export default ProjectTeamPanel;
