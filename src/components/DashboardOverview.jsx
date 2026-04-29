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
    <section className="panel p-5">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="eyebrow">Overview</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            {activeProject ? activeProject.name : 'Dashboard overview'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Progress, completion, and team workload for the current project.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-sm font-medium text-emerald-700">
          <Activity size={16} />
          {completionRate}% completion rate
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.key} className="panel-muted p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{stats[card.key]}</p>
                </div>
                <div className={`rounded-2xl border border-slate-200 bg-white p-3 ${card.accent}`}>
                  <Icon size={16} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="panel-muted p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Task completion</p>
              <h3 className="mt-1 text-base font-semibold text-slate-900">Status distribution</h3>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              Live
            </span>
          </div>

          <div className="mt-4 flex min-h-44 items-end gap-3">
            {statusBreakdown.map((item) => {
              const height = totalTasks ? Math.max(18, Math.round((item.count / totalTasks) * 100)) : 18;

              return (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-36 w-full items-end rounded-xl border border-slate-200 bg-white p-2">
                    <div
                      className={`w-full rounded-lg bg-gradient-to-t ${statusPalette[item.label]} transition-all duration-500`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900">{item.count}</p>
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="panel-muted p-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">User workload</p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">Assignments by teammate</h3>
          </div>

          <div className="mt-4 space-y-2">
            {workload.length ? (
              workload.map((member) => {
                const progress = member.assignedTasks ? Math.round((member.completed / member.assignedTasks) * 100) : 0;

                return (
                  <div key={member.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                        <p className="font-mono text-xs uppercase tracking-[0.12em] text-slate-500">{member.role || 'Member'}</p>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600">
                        {member.assignedTasks} tasks
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{member.completed} completed</span>
                      <span>{progress}% done</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
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
