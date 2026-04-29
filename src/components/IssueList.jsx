import { DndContext, DragOverlay, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { CircleDot, KanbanSquare, Plus, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import EmptyState from './EmptyState';

const columns = ['To Do', 'In Progress', 'Done'];

const statusClasses = {
  'To Do': 'border-slate-200 bg-slate-100 text-slate-700',
  'In Progress': 'border-cyan-200 bg-cyan-50 text-cyan-700',
  Done: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

function IssueCard({ issue, assignee, dragging = false }) {
  return (
    <motion.article
      layout
      className={`rounded-2xl border border-slate-200 bg-white p-3 shadow-md shadow-slate-200/70 transition ${
        dragging ? 'rotate-1 border-cyan-300 bg-cyan-50 shadow-xl shadow-cyan-100/70' : 'hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          {issue.code}
        </span>
        <span className={`rounded-full border px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClasses[issue.status]}`}>
          {issue.status}
        </span>
        {issue.memberReportedDone ? (
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-700">
            Ready for review
          </span>
        ) : null}
        {issue.managerConfirmedDone ? (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
            Confirmed
          </span>
        ) : null}
      </div>

      <h3 className="text-sm font-semibold text-slate-900">{issue.title}</h3>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Assignee</p>
          <div className="mt-1 flex items-center gap-2">
            <UserRound size={14} className="text-cyan-300" />
            <span className="text-sm font-medium text-slate-900">{assignee?.name ?? 'Unassigned'}</span>
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-cyan-700">
          <CircleDot size={16} />
        </div>
      </div>
    </motion.article>
  );
}

function SortableIssueCard({ issue, assignee, onSelectIssue, isSelected }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: issue.id,
    data: { type: 'issue', issue },
    disabled: issue.dragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        type="button"
        onClick={() => onSelectIssue(issue.id)}
        className={`block w-full text-left transition ${isSelected ? 'rounded-2xl ring-2 ring-cyan-400/60 ring-offset-0' : ''}`}
      >
        <IssueCard issue={issue} assignee={assignee} dragging={isDragging} />
      </button>
    </div>
  );
}

function BoardColumn({ status, issues, users, activeIssueId, onSelectIssue, emptyMessage }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: 'column', status },
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-[26px] border p-3 transition ${
        isOver ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-slate-50/80'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{status}</p>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-slate-500">{issues.length} issues</p>
        </div>
        <span className={`rounded-full border px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClasses[status]}`}>
          {status}
        </span>
      </div>

      <SortableContext items={issues.map((issue) => issue.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {issues.map((issue) => (
            <SortableIssueCard
              key={issue.id}
              issue={issue}
              assignee={users.find((user) => user.id === issue.assigneeId)}
              activeIssueId={activeIssueId}
              onSelectIssue={onSelectIssue}
              isSelected={activeIssueId === issue.id}
            />
          ))}

          {!issues.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-center text-sm text-slate-500 transition">
              {emptyMessage}
            </div>
          ) : null}
        </div>
      </SortableContext>
    </div>
  );
}

function IssueList({
  issues,
  users,
  activeProject,
  onCreateIssue,
  onMoveIssue,
  canCreateIssue,
  isAdmin,
  activeIssueId,
  onSelectIssue,
}) {
  const [draggingIssueId, setDraggingIssueId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const groupedIssues = useMemo(
    () =>
      columns.reduce((accumulator, status) => {
        accumulator[status] = issues.filter((issue) => issue.status === status);
        return accumulator;
      }, {}),
    [issues],
  );

  const draggingIssue = draggingIssueId ? issues.find((issue) => issue.id === draggingIssueId) : null;

  const handleDragStart = (event) => {
    setDraggingIssueId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    setDraggingIssueId(null);
    const { active, over } = event;

    if (!over) {
      return;
    }

    const draggedIssue = issues.find((issue) => issue.id === active.id);
    if (!draggedIssue) {
      return;
    }

    const destinationStatus =
      columns.includes(over.id)
        ? over.id
        : issues.find((issue) => issue.id === over.id)?.status;

    if (!destinationStatus || destinationStatus === draggedIssue.status) {
      return;
    }

    await onMoveIssue(draggedIssue, destinationStatus);
  };

  const handleDragCancel = () => {
    setDraggingIssueId(null);
  };

  const emptyColumnMessage = isAdmin ? 'Create an issue, then drag it here' : 'No assigned tasks here yet';

  return (
    <section className="panel p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Issue management</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Delivery board</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isAdmin ? (
              <>
                Drag issues between <span className="text-slate-900">To Do</span>, <span className="text-slate-900">In Progress</span>, and <span className="text-slate-900">Done</span>. Drops update Firebase instantly.
              </>
            ) : (
              <>
                Open your assigned task cards here, update progress, and report finished work for manager review.
              </>
            )}
          </p>
        </div>
        {canCreateIssue ? (
          <button
            type="button"
            onClick={onCreateIssue}
            disabled={!activeProject}
            className="btn-primary gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={16} />
            Create Issue
          </button>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            A project manager must create and assign tasks first.
          </div>
        )}
      </div>

      {activeProject ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="mt-4 grid gap-3 xl:grid-cols-3">
            {columns.map((status) => (
              <BoardColumn
                key={status}
                status={status}
                issues={groupedIssues[status] ?? []}
                users={users}
                activeIssueId={activeIssueId}
                onSelectIssue={onSelectIssue}
                emptyMessage={emptyColumnMessage}
              />
            ))}
          </div>

          <DragOverlay>
            {draggingIssue ? (
              <IssueCard
                issue={draggingIssue}
                assignee={users.find((user) => user.id === draggingIssue.assigneeId)}
                dragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : activeProject ? null : (
        <div className="mt-4">
          <EmptyState
            icon={KanbanSquare}
            title="Select a project"
            description="Choose a workspace from the left rail to open its board, review issue status, and move work across the flow."
          />
        </div>
      )}

      {activeProject && !issues.length ? (
        <div className="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          {isAdmin
            ? 'This project has no issues yet. Use Create Issue to add the first task, assign it to a member, and it will appear on the board immediately.'
            : 'This project has no tasks assigned yet. Ask the project manager to create an issue and assign it to you, then you will be able to open it and mark it completed.'}
        </div>
      ) : (
        null
      )}
    </section>
  );
}

export default IssueList;
