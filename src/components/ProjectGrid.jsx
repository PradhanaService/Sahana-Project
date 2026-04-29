import { motion } from 'framer-motion';
import { FolderOpenDot, MoreHorizontal, Sparkles, Trash2, Users2 } from 'lucide-react';
import EmptyState from './EmptyState';

function ProjectGrid({ projects, activeProjectId, onSelectProject, onCreateProject, onDeleteProject, canManageProjects }) {
  return (
    <section className="panel p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Projects</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Workspace registry</h2>
          <p className="mt-2 text-sm text-slate-600">
            Keep the current workspace visible and switch without leaving the board.
          </p>
        </div>
        {canManageProjects ? (
          <button
            type="button"
            onClick={onCreateProject}
            className="btn-primary"
          >
            Create Project
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId;

          return (
            <motion.button
              key={project.id}
              type="button"
              onClick={() => onSelectProject(project.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`group rounded-xl border p-4 text-left transition ${
                isActive
                  ? 'border-cyan-300 bg-cyan-50 shadow-lg shadow-cyan-100/60'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {project.key}
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-slate-900">{project.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {canManageProjects ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteProject(project);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 size={15} />
                    </button>
                  ) : null}
                  <MoreHorizontal className="text-slate-500 transition group-hover:text-slate-700" size={18} />
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                {project.description || 'Add a short summary for the team to understand this workspace.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-600">
                  <FolderOpenDot size={14} className="text-blue-300" />
                  {project.status || 'Active'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-600">
                  <Users2 size={14} className="text-cyan-300" />
                  {project.division || project.team || 'Core'}
                </span>
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-600">
                  {project.visibility || 'Private'}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {!projects.length ? (
        <EmptyState
          icon={Sparkles}
          title="No projects yet"
          description="Create a workspace to populate the sidebar, unlock issue boards, and start tracking delivery in one place."
          action={
            canManageProjects ? (
              <button
                type="button"
                onClick={onCreateProject}
                className="btn-primary px-5 py-3"
              >
                Create your first project
              </button>
            ) : null
          }
        />
      ) : null}
    </section>
  );
}

export default ProjectGrid;
