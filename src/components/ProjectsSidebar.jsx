import { motion } from 'framer-motion';
import { FolderKanban, LogOut, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import EmptyState from './EmptyState';

function ProjectsSidebar({ currentUser, projects, activeProjectId, onSelectProject, onCreateProject, onSignOut, canManageProjects }) {
  return (
    <aside className="flex min-h-screen flex-col border-r border-slate-200 bg-white/80 px-5 py-6 backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700 shadow-lg shadow-cyan-100">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-slate-900">Sprintforge</p>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">Operations workspace</p>
        </div>
      </div>

      <div className="mb-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-900">
            {currentUser.name?.[0] ?? 'U'}
          </div>
          <div>
            <p className="font-medium text-slate-900">{currentUser.name}</p>
            <p className="text-sm text-slate-600">
              {currentUser.role} | {currentUser.division || currentUser.team}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">{currentUser.companyName || 'Sprintforge'}</p>
            {canManageProjects ? (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                <ShieldCheck size={12} />
                Admin
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        className="mb-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
      >
        <LogOut size={16} />
        Sign out
      </button>

      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Projects</p>
          <p className="mt-1 text-sm text-slate-600">Quick jump between workspaces</p>
        </div>
        {canManageProjects ? (
          <button
            type="button"
            onClick={onCreateProject}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-cyan-400/40 hover:bg-cyan-50"
          >
            <Plus size={16} />
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {projects.map((project) => (
          <motion.button
            key={project.id}
            type="button"
            onClick={() => onSelectProject(project.id)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`group rounded-3xl border px-4 py-4 text-left transition ${
              activeProjectId === project.id
                ? 'border-cyan-300 bg-cyan-50 shadow-lg shadow-cyan-100/70'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                {project.key}
              </div>
              <FolderKanban size={16} className="text-slate-500 transition group-hover:text-slate-700" />
            </div>
            <p className="font-display text-[15px] font-semibold text-slate-900">{project.name}</p>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{project.description || 'No description yet.'}</p>
          </motion.button>
        ))}

        {!projects.length ? (
          <EmptyState
            icon={FolderKanban}
            title="Nothing assigned yet"
            description={
              canManageProjects
                ? 'Use Create Project to add your first workspace and make the sidebar instantly navigable.'
                : 'Ask an admin to add you to a workspace so your project rail can populate.'
            }
          />
        ) : null}
      </div>
    </aside>
  );
}

export default ProjectsSidebar;
