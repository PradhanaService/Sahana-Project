import { Activity, CheckCheck, ClipboardList, TimerReset } from 'lucide-react';

const statCards = [
  {
    key: 'total',
    label: 'Total tasks',
    icon: ClipboardList,
    accent: 'text-cyan-300',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCheck,
    accent: 'text-emerald-300',
  },
  {
    key: 'inProgress',
    label: 'In progress',
    icon: TimerReset,
    accent: 'text-amber-300',
  },
];

const statusPalette = {
  'To Do': 'from-slate-400 to-slate-300',
  'In Progress': 'from-cyan-400 to-sky-300',
  Done: 'from-emerald-400 to-lime-300',
};

function DashboardOverview({ activeProject, issues, users }) {
  const totalTasks = issues.length;
  const completedTasks = issues.filter((issue) => issue.status === 'Done').length;
  const inProgressTasks = issues.filter((issue) => issue.status === 'In Progress').length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusBreakdown = [
    { label: 'To Do', count: issues.filter((issue) => issue.status === 'To Do').length },
    { label: 'In Progress', count: inProgressTasks },
    { label: 'Done', count: completedTasks },
  ];

  const workload = users
    .map((user) => {
      const assignedTasks = issues.filter((issue) => issue.assigneeId === user.id).length;
      const completed = issues.filter((issue) => issue.assigneeId === user.id && issue.status === 'Done').length;

      return {
        id: user.id,
        name: user.name,
        role: user.role,
        assignedTasks,
        completed,
      };
    })
    .filter((user) => user.assignedTasks > 0)
    .sort((left, right) => right.assignedTasks - left.assignedTasks)
    .slice(0, 5);

  const stats = {
    total: totalTasks,
    completed: completedTasks,
    inProgress: inProgressTasks,
  };

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
      <div className="flex flex-col gap-3 border-b border-gray-800 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Overview</p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            {activeProject ? activeProject.name : 'Dashboard overview'}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Progress, completion, and team workload for the current project.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-200">
          <Activity size={16} />
          {completionRate}% completion rate
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.key} className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stats[card.key]}</p>
                </div>
                <div className={`rounded-lg border border-gray-800 bg-gray-900 p-2.5 ${card.accent}`}>
                  <Icon size={16} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Task completion</p>
              <h3 className="mt-1 text-base font-semibold text-white">Status distribution</h3>
            </div>
            <span className="rounded-full border border-gray-800 bg-gray-900 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300">
              Live
            </span>
          </div>

          <div className="mt-4 flex min-h-44 items-end gap-3">
            {statusBreakdown.map((item) => {
              const height = totalTasks ? Math.max(18, Math.round((item.count / totalTasks) * 100)) : 18;

              return (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-36 w-full items-end rounded-xl border border-gray-800 bg-gray-900 p-2">
                    <div
                      className={`w-full rounded-lg bg-gradient-to-t ${statusPalette[item.label]} transition-all duration-500`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">{item.count}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-gray-500">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">User workload</p>
            <h3 className="mt-1 text-base font-semibold text-white">Assignments by teammate</h3>
          </div>

          <div className="mt-4 space-y-2">
            {workload.length ? (
              workload.map((member) => {
                const progress = member.assignedTasks ? Math.round((member.completed / member.assignedTasks) * 100) : 0;

                return (
                  <div key={member.id} className="rounded-lg border border-gray-800 bg-gray-900 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{member.name}</p>
                        <p className="text-xs uppercase tracking-[0.12em] text-gray-500">{member.role || 'Member'}</p>
                      </div>
                      <span className="rounded-full border border-gray-800 bg-gray-950 px-2.5 py-1 text-xs font-semibold text-gray-300">
                        {member.assignedTasks} tasks
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>{member.completed} completed</span>
                      <span>{progress}% done</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-gray-800 bg-gray-900 p-4 text-center text-sm text-gray-500">
                Assign issues to teammates to populate workload insights.
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

export default DashboardOverview;
