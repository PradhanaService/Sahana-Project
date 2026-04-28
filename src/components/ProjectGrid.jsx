import { motion } from 'framer-motion';
import { FolderOpenDot, MoreHorizontal, Sparkles, Trash2, Users2 } from 'lucide-react';
import EmptyState from './EmptyState';

function ProjectGrid({ projects, activeProjectId, onSelectProject, onCreateProject, onDeleteProject, canManageProjects }) {
  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">Projects</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Switch project</h2>
          <p className="mt-1 text-sm text-gray-500">
            Keep the current workspace visible and switch without leaving the board.
          </p>
        </div>
        {canManageProjects ? (
          <button
            type="button"
            onClick={onCreateProject}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
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
                  ? 'border-blue-500 bg-blue-900/20'
                  : 'border-gray-800 bg-gray-950 hover:border-gray-700 hover:bg-gray-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-300">
                    {project.key}
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-white">{project.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {canManageProjects ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteProject(project);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-400 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200"
                    >
                      <Trash2 size={15} />
                    </button>
                  ) : null}
                  <MoreHorizontal className="text-gray-500 transition group-hover:text-gray-300" size={18} />
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-400">
                {project.description || 'Add a short summary for the team to understand this workspace.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs text-gray-300">
                  <FolderOpenDot size={14} className="text-blue-300" />
                  {project.status || 'Active'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs text-gray-300">
                  <Users2 size={14} className="text-cyan-300" />
                  {project.division || project.team || 'Core'}
                </span>
                <span className="inline-flex rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs text-gray-300">
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
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
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
