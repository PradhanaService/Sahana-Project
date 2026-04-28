import { motion } from 'framer-motion';
import { FolderKanban, LogOut, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import EmptyState from './EmptyState';

function ProjectsSidebar({ currentUser, projects, activeProjectId, onSelectProject, onCreateProject, onSignOut, canManageProjects }) {
  return (
    <aside className="flex min-h-screen flex-col border-r border-white/10 bg-slate-950/70 px-5 py-6 backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-cyan-400 text-slate-950 shadow-lg shadow-brand-500/30">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-white">Sprintforge</p>
          <p className="text-sm text-slate-400">Execution workspace</p>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-white">
            {currentUser.name?.[0] ?? 'U'}
          </div>
          <div>
            <p className="font-medium text-white">{currentUser.name}</p>
            <p className="text-sm text-slate-400">
              {currentUser.role} | {currentUser.division || currentUser.team}
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{currentUser.companyName || 'Sprintforge'}</p>
            {canManageProjects ? (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                <ShieldCheck size={12} />
                Admin
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Projects</p>
          <p className="mt-1 text-sm text-slate-400">Quick jump between workspaces</p>
        </div>
        {canManageProjects ? (
          <button
            type="button"
            onClick={onCreateProject}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-brand-400/60 hover:bg-brand-500/10"
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
                ? 'border-brand-400/70 bg-gradient-to-r from-brand-500/20 to-cyan-400/10 shadow-lg shadow-brand-500/10'
                : 'border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/8'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
                {project.key}
              </div>
              <FolderKanban size={16} className="text-slate-500 transition group-hover:text-slate-300" />
            </div>
            <p className="font-display text-base font-semibold text-white">{project.name}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">{project.description || 'No description yet.'}</p>
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

      <button
        type="button"
        onClick={onSignOut}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-white"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </aside>
  );
}

export default ProjectsSidebar;
