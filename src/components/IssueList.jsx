import { DndContext, DragOverlay, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { CircleDot, KanbanSquare, Plus, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import EmptyState from './EmptyState';

const columns = ['To Do', 'In Progress', 'Done'];

const statusClasses = {
  'To Do': 'border-slate-400/20 bg-slate-500/15 text-slate-300',
  'In Progress': 'border-cyan-400/20 bg-cyan-500/15 text-cyan-200',
  Done: 'border-emerald-400/20 bg-emerald-500/15 text-emerald-200',
};

function IssueCard({ issue, assignee, dragging = false }) {
  return (
    <motion.article
      layout
      className={`rounded-lg border border-gray-800 bg-gray-950 p-3 shadow-lg shadow-black/10 transition ${
        dragging ? 'rotate-1 border-blue-500/40 bg-gray-900 shadow-2xl shadow-blue-500/10' : 'hover:border-gray-700 hover:bg-gray-900'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full border border-gray-700 bg-gray-800 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300">
          {issue.code}
        </span>
        <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClasses[issue.status]}`}>
          {issue.status}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-white">{issue.title}</h3>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="rounded-lg border border-gray-800 bg-gray-900 px-2.5 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Assignee</p>
          <div className="mt-1 flex items-center gap-2">
            <UserRound size={14} className="text-cyan-300" />
            <span className="text-sm font-medium text-white">{assignee?.name ?? 'Unassigned'}</span>
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-cyan-300">
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
        className={`block w-full text-left transition ${isSelected ? 'rounded-lg ring-2 ring-blue-500/60 ring-offset-0' : ''}`}
      >
        <IssueCard issue={issue} assignee={assignee} dragging={isDragging} />
      </button>
    </div>
  );
}

function BoardColumn({ status, issues, users, activeIssueId, onSelectIssue }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: 'column', status },
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border p-3 transition ${
        isOver ? 'border-blue-500/50 bg-blue-500/5' : 'border-gray-800 bg-gray-950'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{status}</p>
          <p className="text-xs uppercase tracking-[0.12em] text-gray-500">{issues.length} issues</p>
        </div>
        <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClasses[status]}`}>
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
            <div className="rounded-lg border border-dashed border-gray-800 bg-gray-900 p-4 text-center text-sm text-gray-500 transition">
              Drop issues here
            </div>
          ) : null}
        </div>
      </SortableContext>
    </div>
  );
}

function IssueList({ issues, users, activeProject, onCreateIssue, onMoveIssue, canCreateIssue, activeIssueId, onSelectIssue }) {
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

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Issue Management</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Kanban board</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Drag issues between <span className="text-white">To Do</span>, <span className="text-white">In Progress</span>, and <span className="text-white">Done</span>. Drops update Firebase instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateIssue}
          disabled={!activeProject || !canCreateIssue}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={16} />
          Create Issue
        </button>
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
      ) : (
        <div className="mt-4">
          <EmptyState
            icon={KanbanSquare}
            title="Select a project"
            description="Choose a workspace from the left rail to open its board, review issue status, and move work across the flow."
          />
        </div>
      )}
    </section>
  );
}

export default IssueList;
